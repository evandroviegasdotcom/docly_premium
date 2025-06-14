"use server"

const storageEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/storage`
export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${storageEndpoint}/upload`, {
      method: 'POST',
      body: formData,
    });
    const  data = await response.json();

    return data?.data?.ufsUrl
}


export async function deleteFile(fk: string) {
  const formData = new FormData()
  formData.append("fileKey", fk)
  const response = await fetch(`${storageEndpoint}/delete`, {
    method: "POST",
    body: formData
  })
   const data = await response.json()
   return data
}

