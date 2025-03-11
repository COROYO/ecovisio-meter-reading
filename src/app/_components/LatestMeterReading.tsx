"use client";

import {
  Button,
  Datepicker,
  Label,
  Modal,
  Spinner,
  Table,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { api } from "~/trpc/react";

type MeterReadingsProps = {
  buildingId: string;
};

export function MeterReadings({ buildingId }: MeterReadingsProps) {
  const [openModal, setOpenModal] = useState(false);
  const [newMeterReadingDate, setNewMeterReadingDate] = useState(new Date());
  const [meterValue, setMeterValue] = useState(1);
  const [selectedMeterId, setSelectedMeterId] = useState<undefined | number>();
  const [meterReadingsFilterFrom, setMeterReadingsFilterFrom] =
    useState<null | Date>(null);
  const [meterReadingsFilterTo, setMeterReadingsFilterTo] =
    useState<null | Date>(new Date());

  const { data, isLoading, refetch } = api.meter.getAll.useQuery({
    buildingId: buildingId ? Number(buildingId) : undefined,
    meterReadingsFrom: meterReadingsFilterFrom ?? undefined,
    meterReadingsTo: meterReadingsFilterTo ?? undefined,
  });
  const { mutateAsync, isPending } = api.meter.addNewMeterReading.useMutation();

  function onCloseModal() {
    setOpenModal(false);
    setNewMeterReadingDate(new Date());
    setMeterValue(0);
    setSelectedMeterId(undefined);
  }

  const onSubmitMeterReading = async () => {
    if (typeof selectedMeterId === "number") {
      try {
        await mutateAsync({
          meterId: selectedMeterId,
          meterValue: meterValue,
          readingDate: newMeterReadingDate,
        });
        await refetch();
        onCloseModal();
      } catch (e) {
        console.log("error while submitting new meter reading:", e);
      }
    }
  };

  return (
    <>
      <div className="flex w-full flex-row justify-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            Filter:
            <div>
              from:{" "}
              <Datepicker
                value={meterReadingsFilterFrom}
                onChange={(newDate) => setMeterReadingsFilterFrom(newDate)}
              />
            </div>
            <div>
              to:{" "}
              <Datepicker
                value={meterReadingsFilterTo}
                onChange={(newDate) => setMeterReadingsFilterTo(newDate)}
              />
            </div>
            <Table>
              <Table.Head>
                <Table.HeadCell>Laufnummer</Table.HeadCell>
                <Table.HeadCell>Zählerpunkt</Table.HeadCell>
                <Table.HeadCell>Beschreibung</Table.HeadCell>
                <Table.HeadCell>Gebäude</Table.HeadCell>
                <Table.HeadCell>Bauteil</Table.HeadCell>
                <Table.HeadCell>Raum</Table.HeadCell>
                <Table.HeadCell>Zählernummer</Table.HeadCell>
                <Table.HeadCell>Kunde</Table.HeadCell>
                <Table.HeadCell>Bemerkung</Table.HeadCell>
                <Table.HeadCell>Zählerstand</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {data?.map((meter) => (
                  <Table.Row key={meter.id}>
                    <Table.Cell>{meter.id}</Table.Cell>
                    <Table.Cell>{meter.meterPoint}</Table.Cell>
                    <Table.Cell>{meter.description}</Table.Cell>
                    <Table.Cell>{meter.building?.name}</Table.Cell>
                    <Table.Cell>{meter.component?.name}</Table.Cell>
                    <Table.Cell>{meter.room}</Table.Cell>
                    <Table.Cell>{meter.identifier}</Table.Cell>
                    <Table.Cell>{meter.customer?.name}</Table.Cell>
                    <Table.Cell>{meter.meterReadings[0]?.remarks}</Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setSelectedMeterId(meter.id);
                          setOpenModal(true);
                        }}
                      >
                        {meter.meterReadings[0]?.readingDate &&
                        meter.meterReadings[0]?.value
                          ? `${meter.meterReadings[0]?.readingDate.toLocaleDateString().slice(0, 10)}: ${meter.meterReadings[0]?.value}`
                          : "no reading available"}
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add new meter reading
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateOfReading" value="Date of reading" />
              </div>
              <Datepicker
                value={newMeterReadingDate}
                onChange={(newDate) =>
                  setNewMeterReadingDate(newDate ? newDate : new Date())
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="valueOfReading" value="Value" />
              </div>
              <TextInput
                id="valueOfReading"
                type="number"
                placeholder="123"
                value={meterValue}
                onChange={(event) => setMeterValue(Number(event.target.value))}
                required
              />
            </div>

            <div className="flex justify-end text-sm font-medium text-gray-500 dark:text-gray-300">
              <Button
                disabled={isPending}
                onClick={async () => {
                  await onSubmitMeterReading();
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
