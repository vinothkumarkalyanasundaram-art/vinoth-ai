'use client'
import { useState } from 'react'

const ReadPdfDocuments = () => {
    const [file, setFile] = useState<File | null>(null);
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async () => {
        if (!file) return alert("Upload a file first");

        const formData = new FormData()
        formData.append("file", file);
        formData.append("question", question)

        const res = await fetch("/api/file/", {
            method: "POST",
            body: formData

        })

        const json = await res.json();
        setResponse(json.reply || json.error);



    }

    return (
        <>
            <div className="border text-center grid grid-cols-1 content-center gap-4 content-center p-10 my-10">
                <div className="w-full">
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="upload" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        <input type="text"
                            className=''
                            placeholder='Ask anything...'
                            value={question}
                            onChange={(e => setQuestion(e.target.value))}
                        />
                        <button
                            type="button"
                            name="submit"
                            onClick={handleSubmit}
                            className="border border-[#ccc] px-4 py-1 bg-blue-900 rounded-md text-white">
                            Submit
                        </button>
                    </form>
                    {/* <pre className="mt-4 whitespace-pre-wrap">{response}</pre> */}

                </div>

            </div>
            {response && <div className="w-full">

                <div className="bg-white p-4 rounded shadow my-4 w-full overflow-y-scroll h-64">
                    <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: response }} />
                </div>

            </div>}
        </>
    )
}

export default ReadPdfDocuments;