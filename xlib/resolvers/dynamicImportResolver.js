export default async function dynamicImportResolver(widgetName) {
    const widgetFileName = `/${widgetName}.js`;
    try {
        const widgetClass = (await import(widgetFileName)).default;
        return widgetClass;
    } catch (e) {
        console.warn(`Failed to import widget "${widgetName}"`, e);
        return Promise.reject(e);
    }
}
