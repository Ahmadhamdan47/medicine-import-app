"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Group, Text, ActionIcon } from "@mantine/core"
import { IconArrowsUpDown, IconArrowUp, IconArrowDown } from "@tabler/icons-react"
import { createStyles } from "@mantine/core"

const useStyles = createStyles((theme) => ({
  tableHeaderCell: {
    position: "relative",
    padding: theme.spacing.sm,
    fontWeight: 600,
    userSelect: "none",
    "&:hover $resizeHandle": {
      opacity: 1,
    },
    cursor: "grab",
    "&:active": {
      cursor: "grabbing",
    },
  },
  resizeHandle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "5px",
    cursor: "col-resize",
    opacity: 0,
    transition: "opacity 0.2s",
    backgroundColor: theme.colors.blue[5],
    "&:hover": {
      opacity: 1,
    },
  },
  sortIcon: {
    transition: "transform 0.2s",
  },
}))

interface DraggableHeaderProps {
  column: {
    accessor: string
    title: string
    width: number
  }
  onResize: (columnId: string, width: number) => void
  onSort: (columnId: string) => void
  sortDirection: "asc" | "desc" | null
  sortColumn: string | null
  onDragStart: (columnId: string) => void
  onDragOver: (columnId: string) => void
  onDragEnd: () => void
}

export function DraggableHeader({
  column,
  onResize,
  onSort,
  sortDirection,
  sortColumn,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DraggableHeaderProps) {
  const { classes } = useStyles()
  const [isResizing, setIsResizing] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const isDraggingRef = useRef(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = column.width

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - startXRef.current
    const newWidth = Math.max(50, startWidthRef.current + deltaX)
    onResize(column.accessor, newWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", column.accessor)
    e.dataTransfer.effectAllowed = "move"
    isDraggingRef.current = true
    onDragStart(column.accessor)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isDraggingRef.current) {
      onDragOver(column.accessor)
    }
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    onDragEnd()
  }

  const isSorted = sortColumn === column.accessor

  return (
    <th
      style={{ width: column.width, position: "relative" }}
      className={classes.tableHeaderCell}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Group position="apart" noWrap>
        <Text weight={500}>{column.title}</Text>
        <ActionIcon size="xs" variant="subtle" onClick={() => onSort(column.accessor)}>
          {isSorted ? (
            sortDirection === "asc" ? (
              <IconArrowUp size={14} className={classes.sortIcon} />
            ) : (
              <IconArrowDown size={14} className={classes.sortIcon} />
            )
          ) : (
            <IconArrowsUpDown size={14} className={classes.sortIcon} />
          )}
        </ActionIcon>
      </Group>
      <div className={classes.resizeHandle} onMouseDown={handleMouseDown} />
    </th>
  )
}

