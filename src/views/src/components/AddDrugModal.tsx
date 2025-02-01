// src/components/AddDrugModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Select, TextInput, Group } from '@mantine/core';

interface AddDrugModalProps {
  opened: boolean;
  onClose: () => void;
  onAddSuccess: (newDrug: any) => void;

  // Dropdown data from the parent
  atcOptions: { value: string; label: string }[];
  dosageNumerator1UnitOptions: string[];
  dosageDenominator1UnitOptions: string[];
  formOptions: string[];
  routeOptions: string[];
  // ... add any other dropdown arrays you want to reference
}

const AddDrugModal: React.FC<AddDrugModalProps> = ({
  opened,
  onClose,
  onAddSuccess,
  atcOptions,
  dosageNumerator1UnitOptions,
  dosageDenominator1UnitOptions,
  formOptions,
  routeOptions,
}) => {
  // Here are some example fields from your table
  // You can expand this with more states if you want more fields
  const [drugName, setDrugName] = useState('');
  const [atc, setATC] = useState('');
  const [atcRelatedIngredient, setAtcRelatedIngredient] = useState('');
  const [dosageNumerator1, setDosageNumerator1] = useState('');
  const [dosageNumerator1Unit, setDosageNumerator1Unit] = useState('');
  const [dosageDenominator1, setDosageDenominator1] = useState('');
  const [dosageDenominator1Unit, setDosageDenominator1Unit] = useState('');
  const [form, setForm] = useState('');
  const [route, setRoute] = useState('');

  // Handler to submit form data
  const handleAddDrug = async () => {
    try {
      const newDrugPayload = {
        DrugName: drugName,
        ATC_Code: atc,
        ATCRelatedIngredient: atcRelatedIngredient,
        Dosages: [
          {
            Numerator1: dosageNumerator1,
            Numerator1Unit: dosageNumerator1Unit,
            Denominator1: dosageDenominator1,
            Denominator1Unit: dosageDenominator1Unit,
          },
        ],
        Form: form,
        Route: route,
        // ...include all other fields you want to send to /drugs/add
         

      };

      // Make POST request to your endpoint
      const response = await axios.post('/drugs/add', newDrugPayload);
      const createdDrug = response.data;

      // You can pass the newly created drug object up to the parent
      onAddSuccess(createdDrug);

      // Close the modal upon success
      onClose();
    } catch (error) {
      console.error('Error adding drug:', error);
      // Optionally display a message to the user
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Drug" centered>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Example Text Input */}
        <TextInput
          label="Drug Name"
          placeholder="Enter drug name"
          value={drugName}
          onChange={(e) => setDrugName(e.currentTarget.value)}
        />

        {/* Example Select: ATC */}
        <Select
          label="ATC"
          placeholder="Select ATC"
          data={atcOptions}
          value={atc}
          onChange={(val) => setATC(val || '')}
          clearable
          searchable
        />

        {/* Example Select: ATC Related Ingredient */}
        <Select
          label="ATC Related Ingredient"
          placeholder="Select Ingredient"
          data={atcOptions.map(({ label }) => ({
            value: label,
            label,
          }))}
          value={atcRelatedIngredient}
          onChange={(val) => setAtcRelatedIngredient(val || '')}
          clearable
          searchable
        />

        <Group grow>
          <TextInput
            label="Dosage Numerator 1"
            placeholder="e.g. 500"
            value={dosageNumerator1}
            onChange={(e) => setDosageNumerator1(e.currentTarget.value)}
          />
          <Select
            label="Num1 Unit"
            placeholder="Select unit"
            data={dosageNumerator1UnitOptions.map((opt) => ({ value: opt, label: opt }))}
            value={dosageNumerator1Unit}
            onChange={(val) => setDosageNumerator1Unit(val || '')}
            clearable
            searchable
          />
        </Group>

        <Group grow>
          <TextInput
            label="Dosage Denominator 1"
            placeholder="e.g. 1"
            value={dosageDenominator1}
            onChange={(e) => setDosageDenominator1(e.currentTarget.value)}
          />
          <Select
            label="Deno1 Unit"
            placeholder="Select unit"
            data={dosageDenominator1UnitOptions.map((opt) => ({ value: opt, label: opt }))}
            value={dosageDenominator1Unit}
            onChange={(val) => setDosageDenominator1Unit(val || '')}
            clearable
            searchable
          />
        </Group>

        <Select
          label="Form"
          placeholder="Select form"
          data={formOptions.map((opt) => ({ value: opt, label: opt }))}
          value={form}
          onChange={(val) => setForm(val || '')}
          clearable
          searchable
        />

        <Select
          label="Route"
          placeholder="Select route"
          data={routeOptions.map((opt) => ({ value: opt, label: opt }))}
          value={route}
          onChange={(val) => setRoute(val || '')}
          clearable
          searchable
        />

        <Button variant="filled" color="blue" onClick={handleAddDrug} mt="md">
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default AddDrugModal;
