"use client"

import { useState, useEffect } from "react"
import { Box, Text, Button, Group, TextInput, Checkbox, ScrollArea, Divider } from "@mantine/core"
import { IconFilterOff } from "@tabler/icons-react"

interface ColumnFilterProps {
  columnId: string
  columnTitle: string
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

export function ColumnFilter({ columnId, columnTitle, options, selectedValues, onChange }: ColumnFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues)

  // Sync with parent component when selectedValues changes
  useEffect(() => {
    setLocalSelectedValues(selectedValues)
  }, [selectedValues])

  // Filter options by search term
  const filteredOptions = searchTerm
    ? options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  // Apply filter changes
  const applyChanges = () => {
    onChange(localSelectedValues)
  }

  // Clear all selections
  const clearAll = () => {
    setLocalSelectedValues([])
    onChange([])
  }

  // Toggle a single option
  const toggleOption = (option: string) => {
    setLocalSelectedValues((prev) => {
      if (prev.includes(option)) {
        return prev.filter((v) => v !== option)
      } else {
        return [...prev, option]
      }
    })
  }

  // Select all visible options
  const selectAllVisible = () => {
    setLocalSelectedValues((prev) => {
      const newValues = new Set([...prev])
      filteredOptions.forEach((option) => newValues.add(option))
      return Array.from(newValues)
    })
  }

  // Deselect all visible options
  const deselectAllVisible = () => {
    setLocalSelectedValues((prev) => {
      return prev.filter((value) => !filteredOptions.includes(value))
    })
  }

  return (
    <Box>
      <Text weight={500} mb="xs">
        {columnTitle}
      </Text>

      <TextInput
        placeholder="Search options..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="xs"
        size="xs"
      />

      <Group position="apart" mb="xs">
        <Button size="xs" compact onClick={selectAllVisible}>
          Select All
        </Button>
        <Button size="xs" compact onClick={deselectAllVisible}>
          Deselect All
        </Button>
      </Group>

      <ScrollArea style={{ height: 200 }} offsetScrollbars>
        {filteredOptions.length === 0 ? (
          <Text size="sm" color="dimmed" align="center" py="md">
            No options found
          </Text>
        ) : (
          filteredOptions.map((option) => (
            <Box key={option} py={4}>
              <Checkbox
                label={option}
                checked={localSelectedValues.includes(option)}
                onChange={() => toggleOption(option)}
                size="xs"
              />
            </Box>
          ))
        )}
      </ScrollArea>

      <Divider my="xs" />

      <Group position="apart">
        <Button
          size="xs"
          color="red"
          variant="subtle"
          leftIcon={<IconFilterOff size={14} />}
          onClick={clearAll}
          disabled={localSelectedValues.length === 0}
        >
          Clear
        </Button>
        <Button size="xs" onClick={applyChanges}>
          Apply
        </Button>
      </Group>
    </Box>
  )
}

