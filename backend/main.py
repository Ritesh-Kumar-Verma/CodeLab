from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import subprocess
import tempfile
import os
import uuid


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    language: str
    code: str


class RunResponse(BaseModel):
    output: str
    error: str
    status: str



@app.get("/")
def home():
    return {
        "message": "Code Runner API Running"
    }



@app.post("/api/run", response_model=RunResponse)
def run_code(req: CodeRequest):

    if len(req.code) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Code too large"
        )


    if req.language != "python":
        raise HTTPException(
            status_code=400,
            detail="Only Python supported"
        )


    filename = f"{uuid.uuid4()}.py"


    try:

        with tempfile.TemporaryDirectory() as folder:

            filepath = os.path.join(
                folder,
                filename
            )


            with open(filepath,"w") as f:
                f.write(req.code)



            process = subprocess.run(
                [
                    "python",
                    filepath
                ],
                capture_output=True,
                text=True,
                timeout=5
            )


            if process.returncode == 0:

                return {
                    "output":process.stdout,
                    "error":"",
                    "status":"success"
                }


            return {
                "output":process.stdout,
                "error":process.stderr,
                "status":"error"
            }



    except subprocess.TimeoutExpired:

        return {
            "output":"",
            "error":"Execution timeout (5 seconds)",
            "status":"timeout"
        }


    except Exception as e:

        return {
            "output":"",
            "error":str(e),
            "status":"server_error"
        }