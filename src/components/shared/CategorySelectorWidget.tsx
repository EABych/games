import React from 'react';
import './CategorySelectorWidget.css';

export interface Category {
  id: string;
  name: string;
  count?: number;
  description?: string;
}

interface CategorySelectorWidgetProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  label?: string;
  hint?: string;
  disabled?: boolean;
  maxSelections?: number;
}

export const CategorySelectorWidget: React.FC<CategorySelectorWidgetProps> = ({
  categories,
  selectedCategories,
  onSelectionChange,
  multiSelect = true,
  label = "Категории",
  hint,
  disabled = false,
  maxSelections
}) => {
  const handleCategoryToggle = (categoryId: string) => {
    if (disabled) return;
    
    if (multiSelect) {
      const isSelected = selectedCategories.includes(categoryId);
      let newSelection: string[];
      
      if (isSelected) {
        // Убираем категорию
        newSelection = selectedCategories.filter(id => id !== categoryId);
      } else {
        // Добавляем категорию (если не превышаем лимит)
        if (maxSelections && selectedCategories.length >= maxSelections) {
          return; // Не добавляем, если достигнут лимит
        }
        newSelection = [...selectedCategories, categoryId];
      }
      
      onSelectionChange(newSelection);
    } else {
      // Одиночный выбор
      const newSelection = selectedCategories.includes(categoryId) ? [] : [categoryId];
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className="category-selector-widget">
      {label && <h3 className="widget-label">{label}</h3>}
      
      {hint && (
        <p className="multi-select-hint">{hint}</p>
      )}
      
      <div className="category-grid">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const isDisabled = disabled || 
            !!(maxSelections && !isSelected && selectedCategories.length >= maxSelections);
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`category-button ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-label={`${category.name}${category.count ? `, ${category.count} элементов` : ''}`}
            >
              <div className="category-name">{category.name}</div>
              {category.count !== undefined && (
                <div className="category-count">
                  {category.count} {category.count === 1 ? 'роль' : 'ролей'}
                </div>
              )}
              {category.description && (
                <div className="category-description">{category.description}</div>
              )}
              {isSelected && (
                <div className="category-checkmark">✓</div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="selection-summary">
          <p className="category-hint">
            Выбрано категорий: {categories
              .filter(cat => selectedCategories.includes(cat.id))
              .map(cat => cat.name)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};