document.addEventListener('DOMContentLoaded', () => {

    // --- Utility: Toast Notification ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="text-sm font-medium">${message}</span>`;
        container.appendChild(toast);
        console.log(`[QA Event logged] : ${message}`);
        setTimeout(() => { toast.remove(); }, 3000);
    }

    // --- 1. Global Event Listeners ---
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', (e) => {
            showToast(`Selected: ${e.target.value} from ${e.target.name}`);
        });
    });

    // --- 2. Dynamic Dropdown (Mock API) ---
    const mockDb = {
        na: [{ id: 'us-east-1', name: 'N. Virginia' }, { id: 'us-west-1', name: 'N. California' }],
        eu: [{ id: 'eu-central-1', name: 'Frankfurt' }, { id: 'eu-west-1', name: 'Ireland' }]
    };

    const regionSelect = document.getElementById('dep-region');
    const serverSelect = document.getElementById('dep-server');
    const spinner = document.getElementById('server-spinner');

    regionSelect.addEventListener('change', (e) => {
        serverSelect.disabled = true;
        serverSelect.innerHTML = '<option value="" disabled selected>Loading servers...</option>';
        spinner.classList.remove('hidden');

        // Simulate network delay for explicit wait practice (1.5 seconds)
        setTimeout(() => {
            const servers = mockDb[e.target.value] || [];
            serverSelect.innerHTML = '<option value="" disabled selected>2. Select Server</option>';
            servers.forEach(server => {
                const opt = document.createElement('option');
                opt.value = server.id;
                opt.textContent = server.name;
                // Add test-id for automation
                opt.setAttribute('data-testid', `server-${server.id}`);
                serverSelect.appendChild(opt);
            });
            serverSelect.disabled = false;
            spinner.classList.add('hidden');
            showToast('Servers loaded successfully');
        }, 1500);
    });

    // --- 3. Delayed Dropdown Element ---
    const delayBtn = document.getElementById('trigger-delayed-dropdown');
    const delayContainer = document.getElementById('delayed-container');

    delayBtn.addEventListener('click', () => {
        delayBtn.innerHTML = 'Decrypting Data...';
        delayBtn.disabled = true;

        // Wait 2 seconds before making element interactable
        setTimeout(() => {
            delayContainer.classList.remove('hidden');
            // Allow CSS transition to process
            requestAnimationFrame(() => {
                delayContainer.classList.remove('opacity-0');
            });
            delayBtn.style.display = 'none';
            showToast('Secret Dropdown Revealed');
        }, 2000);
    });

    // --- 4. Custom Multi-Select with Chips ---
    const tagInput = document.getElementById('tag-input');
    const tagDropdown = document.getElementById('tag-dropdown');
    const container = document.getElementById('multi-select-container');
    const tagOptions = tagDropdown.querySelectorAll('li');
    let selectedTags = new Set();

    // Show custom dropdown on click
    container.addEventListener('click', () => {
        tagDropdown.classList.remove('hidden');
        tagInput.focus();
    });

    // Hide on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && !tagDropdown.contains(e.target)) {
            tagDropdown.classList.add('hidden');
        }
    });

    // Add Tag logic
    tagOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const val = e.target.getAttribute('data-value');
            const text = e.target.textContent;

            if (!selectedTags.has(val)) {
                selectedTags.add(val);

                // Create chip (Updated to Light Theme styling)
                const chip = document.createElement('div');
                chip.className = 'bg-amber-100 text-amber-700 border border-amber-200 px-2 py-1 rounded-md text-sm flex items-center gap-2 backdrop-blur-md z-10 shadow-sm';
                chip.innerHTML = `${text} <button type="button" class="text-amber-500 hover:text-amber-800" data-testid="remove-${val}">&times;</button>`;

                // Remove logic
                chip.querySelector('button').addEventListener('click', (btnEvent) => {
                    btnEvent.stopPropagation();
                    selectedTags.delete(val);
                    chip.remove();
                    showToast(`Removed tag: ${text}`);
                });

                container.insertBefore(chip, tagInput);
                showToast(`Added tag: ${text}`);
            }
            tagInput.value = '';
            tagDropdown.classList.add('hidden');
        });
    });

    // Filter tags on typing
    tagInput.addEventListener('keyup', (e) => {
        const filter = e.target.value.toLowerCase();
        tagOptions.forEach(opt => {
            if (opt.textContent.toLowerCase().includes(filter)) {
                opt.style.display = 'block';
            } else {
                opt.style.display = 'none';
            }
        });
    });

    // --- 5. Shadow DOM Injection (Light Theme Updated) ---
    const shadowHost = document.getElementById('shadow-host');
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
        <style>
            select {
                width: 100%;
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.05);
                color: #0f172a;
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                outline: none;
                font-family: 'Inter', sans-serif;
                box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.01);
            }
            select:focus { 
                border-color: #f59e0b; 
                box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
                background: #ffffff;
            }
            option { background: #ffffff; color: #0f172a; }
        </style>
        <div>
            <label style="display:block; font-size:14px; color:#64748b; margin-bottom:8px;">Framework Selector (Inside Shadow Root)</label>
            <select id="shadow-select" name="framework" data-testid="shadow-select" aria-label="Shadow Dropdown">
                <option value="wdio">WebdriverIO</option>
                <option value="testcafe">TestCafe</option>
                <option value="puppeteer">Puppeteer</option>
            </select>
        </div>
    `;

    shadowRoot.querySelector('select').addEventListener('change', (e) => {
        showToast(`Shadow DOM selected: ${e.target.value}`);
    });
});