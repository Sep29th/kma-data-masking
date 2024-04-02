import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
const initialItems = {
  'list-1': ['Item 1', 'Item 2', 'Item 3'],
  'list-2': ['Item 4', 'Item 5', 'Item 6']
}
const Authorization = () => {
  const [items, setItems] = useState(initialItems)

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceList = [...items[source.droppableId]]
      const destList = [...items[destination.droppableId]]
      const [removed] = sourceList.splice(source.index, 1)
      destList.splice(destination.index, 0, removed)
      setItems({
        ...items,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      })
    } else {
      const list = [...items[source.droppableId]]
      const [removed] = list.splice(source.index, 1)
      list.splice(destination.index, 0, removed)
      setItems({ ...items, [source.droppableId]: list })
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {Object.entries(items).map(([listId, listItems]) => (
        <Droppable droppableId={listId} key={listId}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {listItems.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  )
}

export default Authorization
