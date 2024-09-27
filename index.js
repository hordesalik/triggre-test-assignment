import X from './xlib/X.js';
import buildElementInfo from './helpers/buildElementInfo.js';
import {buildLogItem, buildErrorListItem} from './helpers/buildLogItem.js';

(() => {
    const xInstance = new X();
    const rootElement = document.getElementById('root');

    // Selected element tracking
    const elementInfo = document.getElementById('elementInfo');
    let selectedElement;

    function renderElementInfo(element) {
        elementInfo.innerHTML = buildElementInfo(element, rootElement);
    }

    function setSelectedElement(newSelectedElement) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        selectedElement = newSelectedElement;
        newSelectedElement.classList.add('selected');
        renderElementInfo(newSelectedElement);
    }

    setSelectedElement(rootElement);

    function handleRootClick(event) {
        setSelectedElement(event.target);
    }

    rootElement.addEventListener('click', handleRootClick);

    // Toolbar buttons
    const btnInit = document.getElementById('btnInit');
    const btnDestroy = document.getElementById('btnDestroy');
    const btnDone = document.getElementById('btnDone');
    const btnFail = document.getElementById('btnFail');
    const logContent = document.getElementById('logContent');

    function handleInitClick() {
        const logItem = buildLogItem(selectedElement, rootElement);
        logItem.setAttribute('status', 'loading');
        logContent.appendChild(logItem);

        xInstance.init(selectedElement,
            (errors) => {
                console.debug('Initilization callback', errors);
                logItem.setAttribute('status', errors.length ? 'error' : 'success');
                if (errors.length) {
                    logItem.appendChild(buildErrorListItem(errors));
                }
            })
            .then((errors) => {
                console.debug('Initialization promise resolved completed', errors);
            })
            .catch((error) => {
                console.error(`Failed to initialize`, error);
            });
    }

    function handleDestroyClick() {
        xInstance.destroy(selectedElement)
    }

    function handleDoneClick() {
        xInstance.elementWidgetMap.get(selectedElement)?.finish();
    }

    function handleFailClick() {
        xInstance.elementWidgetMap.get(selectedElement)?.fail();
    }

    btnInit.addEventListener('click', handleInitClick);
    btnDestroy.addEventListener('click', handleDestroyClick);
    btnDone.addEventListener('click', handleDoneClick);
    btnFail.addEventListener('click', handleFailClick);
})();
