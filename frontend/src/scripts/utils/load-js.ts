function loadJS(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const script = window.document.createElement( "script" );

        script.src = src;
        script.async = true;
        document.head.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
    });
}

export default loadJS;
