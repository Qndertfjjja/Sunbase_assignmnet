// Initial form data
let formData = [
    {
        id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
        type: "input",
        label: "Sample Input",
        placeholder: "Sample placeholder"
    },
    {
        id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        type: "select",
        label: "Sample Select",
        options: ["Sample Option", "Sample Option", "Sample Option"]
    },
    {
        id: "45002ecf-85cf-4852-bc46-529f94a758f5",
        type: "textarea",
        label: "Sample Textarea",
        placeholder: "Sample Placeholder"
    },
    {
        id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
        type: "checkbox",
        label: "Sample Checkbox"
    }
];

// DOM Elements
const formElements = document.getElementById('formElements');
const components = document.querySelectorAll('.component');
const saveButton = document.getElementById('saveButton');
const themeToggle = document.getElementById('themeToggle');
const previewButton = document.getElementById('previewButton');
const previewModal = document.getElementById('previewModal');
const closeModalBtn = document.querySelector('.close-btn');
const copyHtmlButton = document.getElementById('copyHtmlButton');

// Theme Management
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update theme toggle icon visibility
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    lightIcon.style.display = isDark ? 'none' : 'inline';
    darkIcon.style.display = isDark ? 'inline' : 'none';
}

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon = themeToggle.querySelector('.dark-icon');
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'inline';
}

themeToggle.addEventListener('click', toggleTheme);

// Generate unique ID
function generateId() {
    return crypto.randomUUID();
}

// Create form element
function createFormElement(data) {
    const element = document.createElement('div');
    element.className = 'form-element';
    element.draggable = true;
    element.dataset.id = data.id;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => {
        formData = formData.filter(item => item.id !== data.id);
        renderFormElements();
    };
    element.appendChild(deleteBtn);

    // Label input
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.value = data.label;
    labelInput.placeholder = 'Enter label';
    labelInput.onchange = (e) => {
        const index = formData.findIndex(item => item.id === data.id);
        if (index !== -1) {
            formData[index].label = e.target.value;
        }
    };
    element.appendChild(labelInput);

    // Create specific element based on type
    switch (data.type) {
        case 'input':
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = data.placeholder || '';
            input.onchange = (e) => {
                const index = formData.findIndex(item => item.id === data.id);
                if (index !== -1) {
                    formData[index].placeholder = e.target.value;
                }
            };
            element.appendChild(input);
            break;

        case 'select':
            const select = document.createElement('select');
            data.options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                select.appendChild(option);
            });
            element.appendChild(select);

            // Options management
            const optionControls = document.createElement('div');
            optionControls.className = 'option-controls';
            
            const addOptionBtn = document.createElement('button');
            addOptionBtn.textContent = 'Add Option';
            addOptionBtn.onclick = () => {
                const index = formData.findIndex(item => item.id === data.id);
                if (index !== -1) {
                    formData[index].options.push(`Option ${formData[index].options.length + 1}`);
                    renderFormElements();
                }
            };
            optionControls.appendChild(addOptionBtn);

            const optionList = document.createElement('div');
            optionList.className = 'option-list';
            data.options.forEach((optionText, optionIndex) => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                optionItem.textContent = optionText;
                
                const deleteOptionBtn = document.createElement('button');
                deleteOptionBtn.innerHTML = '×';
                deleteOptionBtn.onclick = () => {
                    const index = formData.findIndex(item => item.id === data.id);
                    if (index !== -1) {
                        formData[index].options.splice(optionIndex, 1);
                        renderFormElements();
                    }
                };
                optionItem.appendChild(deleteOptionBtn);
                optionList.appendChild(optionItem);
            });
            
            optionControls.appendChild(optionList);
            element.appendChild(optionControls);
            break;

        case 'textarea':
            const textarea = document.createElement('textarea');
            textarea.placeholder = data.placeholder || '';
            textarea.onchange = (e) => {
                const index = formData.findIndex(item => item.id === data.id);
                if (index !== -1) {
                    formData[index].placeholder = e.target.value;
                }
            };
            element.appendChild(textarea);
            break;

        case 'checkbox':
            const checkboxWrapper = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkboxWrapper.appendChild(checkbox);
            element.appendChild(checkboxWrapper);
            break;
    }

    // Drag and drop event listeners
    element.addEventListener('dragstart', (e) => {
        element.classList.add('dragging');
        e.dataTransfer.setData('text/plain', data.id);
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
    });

    return element;
}

// Generate preview HTML
function generatePreviewHtml() {
    let html = '<form>\n';
    formData.forEach(data => {
        html += '  <div class="form-group">\n';
        html += `    <label for="${data.id}">${data.label}</label>\n`;
        
        switch (data.type) {
            case 'input':
                html += `    <input type="text" id="${data.id}" placeholder="${data.placeholder || ''}">\n`;
                break;
            case 'select':
                html += `    <select id="${data.id}">\n`;
                data.options.forEach(option => {
                    html += `      <option value="${option}">${option}</option>\n`;
                });
                html += '    </select>\n';
                break;
            case 'textarea':
                html += `    <textarea id="${data.id}" placeholder="${data.placeholder || ''}"></textarea>\n`;
                break;
            case 'checkbox':
                html += `    <input type="checkbox" id="${data.id}">\n`;
                break;
        }
        
        html += '  </div>\n';
    });
    html += '</form>';
    return html;
}

// Create preview form
function createPreviewForm() {
    const preview = document.getElementById('formPreview');
    preview.innerHTML = '';
    
    const form = document.createElement('form');
    formData.forEach(data => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const label = document.createElement('label');
        label.htmlFor = data.id;
        label.textContent = data.label;
        group.appendChild(label);
        
        switch (data.type) {
            case 'input':
                const input = document.createElement('input');
                input.type = 'text';
                input.id = data.id;
                input.placeholder = data.placeholder || '';
                group.appendChild(input);
                break;
            case 'select':
                const select = document.createElement('select');
                select.id = data.id;
                data.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    select.appendChild(option);
                });
                group.appendChild(select);
                break;
            case 'textarea':
                const textarea = document.createElement('textarea');
                textarea.id = data.id;
                textarea.placeholder = data.placeholder || '';
                group.appendChild(textarea);
                break;
            case 'checkbox':
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = data.id;
                group.appendChild(checkbox);
                break;
        }
        
        form.appendChild(group);
    });
    
    preview.appendChild(form);
}

// Render form elements
function renderFormElements() {
    formElements.innerHTML = '';
    formData.forEach(element => {
        formElements.appendChild(createFormElement(element));
    });
}

// Add new element handlers
components.forEach(component => {
    component.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', component.dataset.type);
    });

    component.querySelector('.add-btn').addEventListener('click', () => {
        const type = component.dataset.type;
        const newElement = {
            id: generateId(),
            type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            placeholder: type === 'select' ? undefined : 'Enter value',
            options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
        };
        formData.push(newElement);
        renderFormElements();
    });
});

// Drag and drop functionality
formElements.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(formElements, e.clientY);
    const draggable = document.querySelector('.dragging');
    
    if (draggable) {
        if (afterElement == null) {
            formElements.appendChild(draggable);
        } else {
            formElements.insertBefore(draggable, afterElement);
        }
    }
});

formElements.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const id = e.dataTransfer.getData('text/plain');

    if (type && !id) {
        // Adding new element
        const newElement = {
            id: generateId(),
            type,
            label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            placeholder: type === 'select' ? undefined : 'Enter value',
            options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
        };
        formData.push(newElement);
        renderFormElements();
    } else if (id) {
        // Reordering existing element
        const draggingElement = formData.find(item => item.id === id);
        const afterElement = getDragAfterElement(formElements, e.clientY);
        
        if (draggingElement) {
            formData = formData.filter(item => item.id !== id);
            const afterElementIndex = afterElement 
                ? formData.findIndex(item => item.id === afterElement.dataset.id)
                : formData.length;
            
            formData.splice(afterElementIndex, 0, draggingElement);
            renderFormElements();
        }
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Preview Modal Management
previewButton.addEventListener('click', () => {
    previewModal.style.display = 'block';
    createPreviewForm();
    document.getElementById('generatedHtml').textContent = generatePreviewHtml();
});

closeModalBtn.addEventListener('click', () => {
    previewModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        previewModal.style.display = 'none';
    }
});

// Copy HTML functionality
copyHtmlButton.addEventListener('click', async () => {
    const htmlContent = generatePreviewHtml();
    try {
        await navigator.clipboard.writeText(htmlContent);
        copyHtmlButton.textContent = 'Copied!';
        setTimeout(() => {
            copyHtmlButton.textContent = 'Copy HTML';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
});

// Save form data
saveButton.addEventListener('click', () => {
    console.log('Form Data:', JSON.stringify(formData, null, 2));
});

// Initial render
renderFormElements();