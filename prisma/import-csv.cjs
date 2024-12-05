const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const csvFilePath = "./data.csv"; // Path to your CSV file
  const records = [];

  // Read the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ",", // Use ',' as the separator in your CSV file
        mapHeaders: ({ header, index }) => header.trim(),
      }),
    )
    .on("data", (row) => {
      // Parse and clean up the data for each row
      records.push({
        identifier: row["Zählernummer"] ? row["Zählernummer"].trim() : null,
        description: row["Beschreibung"] ? row["Beschreibung"].trim() : null,
        building: row["Gebäude"] ? row["Gebäude"].trim() : null,
        component: row["Bauteil"] ? row["Bauteil"].trim() : null,
        meterPoint: row["Zählerpunkt"] ? row["Zählerpunkt"].trim() : null,
        room: row["Raum"] ? row["Raum"].trim() : null,
        customer: row["Kunde"] ? row["Kunde"].trim() : null,
        parentMeter: row["Übergeordneter Zählerpunkt"]
          ? row["Übergeordneter Zählerpunkt"].trim()
          : null,
        customerPoint: row["Zählerpunkt"] ? row["Zählerpunkt"].trim() : null,
        remarks: row["Bemerkung"] ? row["Bemerkung"].trim() : null,
        reading: row["Zählerstand 30.09.2024"]
          ? parseFloat(row["Zählerstand 30.09.2024"].replace(",", "."))
          : null,
      });
    })
    .on("end", async () => {
      console.log(
        "CSV file successfully processed. Inserting data into database...",
      );

      // Insert data into the database using Prisma
      for (const record of records) {
        try {
          // Insert or find the customer
          let customer = await prisma.customer.upsert({
            where: { name: record.customer },
            update: {},
            create: { name: record.customer },
          });

          // Insert or find the building
          let building = await prisma.building.upsert({
            where: { name: record.building },
            update: {},
            create: { name: record.building },
          });

          // Insert or find the component
          let component = await prisma.component.upsert({
            where: { name: record.component },
            update: {},
            create: { name: record.component },
          });

          // Insert the meter
          let meter = await prisma.meter.create({
            data: {
              identifier: record.identifier,
              description: record.description,
              meterPoint: record.meterPoint,
              room: record.room,
              customerId: customer.id,
              buildingId: building.id,
              componentId: component.id,
              parentMeterId: record.parentMeter
                ? (
                    await prisma.meter.findUnique({
                      where: { identifier: record.parentMeter },
                    })
                  )?.id
                : null,
              customerPoint: record.customerPoint,
            },
          });

          // Insert the reading if it exists
          if (record.reading !== null) {
            await prisma.meterReading.create({
              data: {
                meterId: meter.id,
                readingDate: new Date("2024-09-30"),
                value: record.reading,
                remarks: record.remarks,
              },
            });
          }
        } catch (error) {
          console.error(
            `Error inserting record for meter ${record.identifier}:`,
            error,
          );
        }
      }

      console.log("Data insertion complete.");
      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
