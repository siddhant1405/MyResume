import React from "react";
import GradientButton from "./GradientButton";

export default function SectionEditor({
  title,
  items = [],
  onChange,
  onTitleChange,
  onDelete,
  placeholder = "Add details here...",
  itemType = "textarea",
  defaultItem = ""
}) {
  // Ensure items is always an array with safe fallback
  const safeItems = Array.isArray(items) ? items : [];

  const handleItemChange = (index, value) => {
    const newItems = [...safeItems];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...safeItems, defaultItem]);
  };

  const removeItem = (index) => {
    if (safeItems.length > 1) {
      const newItems = safeItems.filter((_, i) => i !== index);
      onChange(newItems);
    }
  };

  // Handle different item types (string vs object)
  const renderItem = (item, index) => {
    if (typeof item === 'string') {
      // For custom sections (string items)
      return (
        <div key={index} className="flex items-start mb-3 group">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry #{index + 1}
            </label>
            {itemType === "textarea" ? (
              <textarea
                value={item || ""}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 border border-gray-300 rounded-md resize-y"
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={item || ""}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            )}
          </div>
          {safeItems.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="ml-2 text-gray-500 hover:text-red-500 transition-opacity"
            >
              ✕
            </button>
          )}
        </div>
      );
    } else {
      // For structured sections (object items)
      return (
        <div key={index} className="border border-gray-300 rounded-md p-4 mb-4 bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entry #{index + 1}
          </label>
          {Object.keys(item || {}).map((field) => (
            <input
              key={field}
              type="text"
              value={item[field] || ""}
              onChange={(e) => {
                const newItems = [...safeItems];
                newItems[index] = { ...newItems[index], [field]: e.target.value };
                onChange(newItems);
              }}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-3 border border-gray-300 rounded-md mb-2"
            />
          ))}
          {safeItems.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove Entry
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
      {/* Section Title and Delete */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={title || ""}
          onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
          placeholder="Section Title"
          className="text-xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-blue-600 outline-none w-full"
        />
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-4 text-red-600 hover:text-red-700"
          >
            Delete Section
          </button>
        )}
      </div>

      {/* Render Items */}
      {safeItems.map((item, index) => renderItem(item, index))}

      {/* Add Item Button */}
      <GradientButton
        type="button"
        onClick={addItem}
        variant="outline"
        className="mt-2"
      >
        + Add Entry
      </GradientButton>
    </div>
  );
}
