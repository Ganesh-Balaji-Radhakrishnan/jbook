import { useState, useEffect, useRef } from "react";
import ReactDOM  from "react-dom/client";
import * as esbuild from "esbuild-wasm"
import {unpkgPathPlugin} from './plugins/unpkg-path-plugin'

const App:React.FC = ( ) => {
    const [input, setInput] = useState('')
    const [code, setCode] = useState('')
    const ref = useRef<any>()

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        })
    }

    useEffect(()=>{
        startService()
    }, [])

    const onClick = async ( ) => {
        if(!ref.current){
            return
        }
        /* const result = await ref.current.transform(input, {
            loader: 'jsx',
            target: 'es2015',
        }) */

        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()]
        })

        setCode(result.outputFiles[0].text)
    }

    return <div>
        <textarea value={input} onChange={e=>setInput(e.target.value)}></textarea>
        <div><button onClick={onClick}>submit</button></div>
        <pre>{code}</pre>
    </div>
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
     <App />
);
