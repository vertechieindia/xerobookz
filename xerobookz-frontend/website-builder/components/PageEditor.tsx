'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from './ui/Button';
import { Plus, Settings, Trash2 } from 'lucide-react';

interface PageEditorProps {
  page: any;
  websiteId: string;
  theme?: any;
}

export function PageEditor({ page, websiteId, theme }: PageEditorProps) {
  const [blocks, setBlocks] = useState(
    page.content?.blocks || [
      {
        id: '1',
        type: 'hero',
        content: {
          title: 'Welcome to XeroBookz',
          subtitle: 'Create your professional website in minutes',
          cta: { text: 'Get Started', link: '/contact' },
        },
      },
    ]
  );

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  const addBlock = (type: string) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      hero: {
        title: 'Welcome',
        subtitle: 'Your subtitle here',
        cta: { text: 'Get Started', link: '#' },
      },
      text: {
        heading: 'Heading',
        body: 'Your content here',
      },
      features: {
        title: 'Features',
        items: [
          { title: 'Feature 1', description: 'Description' },
          { title: 'Feature 2', description: 'Description' },
        ],
      },
    };
    return defaults[type] || {};
  };

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 text-center rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{block.content.title}</h1>
            <p className="text-xl mb-6">{block.content.subtitle}</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              {block.content.cta?.text || 'Get Started'}
            </Button>
          </div>
        );
      case 'text':
        return (
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{block.content.heading}</h2>
            <p className="text-gray-600">{block.content.body}</p>
          </div>
        );
      case 'features':
        return (
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">{block.content.title}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {block.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border border-gray-200 rounded">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <p className="text-gray-600">Block type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative group ${
                          snapshot.isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move p-2 bg-white rounded shadow"
                          >
                            ⋮⋮
                          </div>
                        </div>
                        <div className="relative">
                          {renderBlock(block, index)}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white"
                              onClick={() => {}}
                            >
                              <Settings size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white text-red-600"
                              onClick={() => {
                                setBlocks(blocks.filter((b) => b.id !== block.id));
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Block Button */}
        <div className="mt-6 flex justify-center">
          <div className="relative group">
            <Button
              onClick={() => {}}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2" size={16} />
              Add Block
            </Button>
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => addBlock('hero')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
              >
                Hero Section
              </button>
              <button
                onClick={() => addBlock('text')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
              >
                Text Block
              </button>
              <button
                onClick={() => addBlock('features')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
              >
                Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
