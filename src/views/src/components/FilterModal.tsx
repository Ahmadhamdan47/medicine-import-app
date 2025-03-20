"use client"

import { useState, useMemo } from "react"
import { Modal, Text, Button, Group, Box, Checkbox, TextInput, Tabs, ScrollArea, Badge, Divider } from "@mantine/core"
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react"

interface FilterModalProps {
  opened: boolean
  onClose: () => void
  columns: { accessor: string; title: string }[]
  tableData: any[]
  columnFilters: Record<string, string[]>
  activeFilters: string[]
  onFilterChange: (columnId: string, values: string[]) => void
  onClearAllFilters: () => void
}

export function FilterModal({
  opened,
  onClose,
  columns,
  tableData,
  columnFilters,
  activeFilters,
  onFilterChange,
  onClearAllFilters,
}: FilterModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string | null>("active")

  // Group columns by category
  const columnGroups = useMemo(() => {
    const groups: Record<string, { accessor: string; title: string }[]> = {
      "Basic Info": [],
      Dosage: [],
      "Form & Route": [],
      Presentation: [],
      Other: [],
    }

    columns.forEach((col) => {
      if (
        col.accessor.includes("Dosage") ||
        col.accessor.includes("Numerator") ||
        col.accessor.includes("Denominator")
      ) {
        groups["Dosage"].push(col)
      } else if (col.accessor.includes("Form") || col.accessor.includes("Route")) {
        groups["Form & Route"].push(col)
      } else if (col.accessor.includes("Presentation")) {
        groups["Presentation"].push(col)
      } else if (
        ["DrugName", "DrugNameAR", "ATC", "ATCRelatedIngredient", "OtherIngredients", "Seq", "ProductType"].includes(
          col.accessor,
        )
      ) {
        groups["Basic Info"].push(col)
      } else {
        groups["Other"].push(col)
      }
    })

    return groups
  }, [columns])

  // Get unique values for a column (for filter options)
  const getFilterOptions = (columnId: string) => {
    const uniqueValues = new Set<string>()

    tableData.forEach((row) => {
      const value = row[columnId]
      if (value !== null && value !== undefined && value !== "" && value !== "N/A") {
        uniqueValues.add(value.toString())
      }
    })

    return Array.from(uniqueValues).sort()
  }

  // Filter columns by search term
  const filteredColumns = useMemo(() => {
    if (!searchTerm) return columns

    return columns.filter(
      (col) =>
        col.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.accessor.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [columns, searchTerm])

  // Render filter options for a column
  const renderFilterOptions = (column: { accessor: string; title: string }) => {
    const options = getFilterOptions(column.accessor)
    const selectedValues = columnFilters[column.accessor] || []

    // Filter options by search term
    const filteredOptions = searchTerm
      ? options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
      : options

    if (filteredOptions.length === 0) {
      return (
        <Text size="sm" color="dimmed" py="xs">
          No filter options available
        </Text>
      )
    }

    return (
      <ScrollArea h={200} pr={10}>
        {filteredOptions.map((option) => (
          <Box key={option} py={4}>
            <Checkbox
              label={option}
              checked={selectedValues.includes(option)}
              onChange={(e) => {
                const isChecked = e.currentTarget.checked
                const newValues = isChecked ? [...selectedValues, option] : selectedValues.filter((v) => v !== option)
                onFilterChange(column.accessor, newValues)
              }}
            />
          </Box>
        ))}
      </ScrollArea>
    )
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group position="apart">
          <Text size="lg" weight={600}>
            Filter Data
          </Text>
          <Group spacing="xs">
            {activeFilters.length > 0 && (
              <Badge color="blue" size="sm">
                {activeFilters.length} active filter{activeFilters.length !== 1 ? "s" : ""}
              </Badge>
            )}
            <Button
              variant="subtle"
              compact
              color="red"
              onClick={onClearAllFilters}
              disabled={activeFilters.length === 0}
            >
              <IconX size={14} />
              Clear All
            </Button>
          </Group>
        </Group>
      }
      size="xl"
    >
      <TextInput
        placeholder="Search columns or filter values..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<IconSearch size={16} />}
        mb="md"
      />

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="active" icon={<IconFilter size={14} />}>
            Active Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Tabs.Tab>
          {Object.keys(columnGroups).map((group) => (
            <Tabs.Tab key={group} value={group}>
              {group}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="active" pt="md">
          {activeFilters.length === 0 ? (
            <Text color="dimmed" align="center" py="xl">
              No active filters
            </Text>
          ) : (
            activeFilters.map((columnId) => {
              const column = columns.find((col) => col.accessor === columnId)
              if (!column) return null

              return (
                <Box key={columnId} mb="lg">
                  <Group position="apart" mb="xs">
                    <Text weight={500}>{column.title}</Text>
                    <Button variant="subtle" compact color="red" onClick={() => onFilterChange(columnId, [])}>
                      Clear
                    </Button>
                  </Group>
                  {renderFilterOptions(column)}
                  <Divider my="md" />
                </Box>
              )
            })
          )}
        </Tabs.Panel>

        {Object.entries(columnGroups).map(([group, cols]) => (
          <Tabs.Panel key={group} value={group} pt="md">
            {cols.map((column) => {
              const isActive = activeFilters.includes(column.accessor)

              return (
                <Box key={column.accessor} mb="lg">
                  <Group position="apart" mb="xs">
                    <Group>
                      <Text weight={500}>{column.title}</Text>
                      {isActive && (
                        <Badge size="xs" color="blue">
                          Active
                        </Badge>
                      )}
                    </Group>
                    {isActive && (
                      <Button variant="subtle" compact color="red" onClick={() => onFilterChange(column.accessor, [])}>
                        Clear
                      </Button>
                    )}
                  </Group>
                  {renderFilterOptions(column)}
                  <Divider my="md" />
                </Box>
              )
            })}
          </Tabs.Panel>
        ))}
      </Tabs>

      <Group position="right" mt="xl">
        <Button onClick={onClose}>Close</Button>
      </Group>
    </Modal>
  )
}

export default FilterModal

