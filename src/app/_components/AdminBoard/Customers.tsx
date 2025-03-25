"use client";

import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { api } from "../../../trpc/react";

export function Customers() {
  const {
    data: customerData,
    isFetching,
    refetch,
  } = api.customer.getAll.useQuery();
  const {
    mutateAsync: mutateAsyncAddCustomer,
    isPending: isPendingAddCustomer,
  } = api.customer.addCustomer.useMutation();
  const {
    mutateAsync: mutateAsyncDeleteCustomer,
    isPending: isPendingRemoveCustomer,
  } = api.customer.deleteCustomer.useMutation();
  const [newCustomerName, setNewCustomerName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const customerInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="">
      {isFetching && <Spinner />}
      {customerData?.map((customer) => (
        <div
          className="flex flex-row items-center justify-between border px-2 py-1"
          key={customer.id}
        >
          {customer.name}
          <Button
            disabled={isPendingRemoveCustomer}
            onClick={async () => {
              await mutateAsyncDeleteCustomer({ id: customer.id });
              await refetch();
            }}
          >
            {isPendingRemoveCustomer ? <Spinner /> : "delete"}
          </Button>
        </div>
      ))}
      <div>
        <Button onClick={() => setOpenModal(() => true)}>add customer</Button>
      </div>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={customerInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="customerName" value="customer name" />
              </div>
              <TextInput
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                id="customerName"
                ref={customerInputRef}
                required
              />
            </div>

            <div className="w-full">
              <Button
                disabled={isPendingAddCustomer}
                onClick={async () => {
                  await mutateAsyncAddCustomer({ name: newCustomerName });
                  await refetch();
                  setNewCustomerName("");
                  setOpenModal(false);
                }}
              >
                Create customer
              </Button>
              {isPendingAddCustomer && <Spinner />}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
