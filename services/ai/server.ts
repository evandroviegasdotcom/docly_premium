"use server"

const endpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/summarize`
export async function summarizeFile(url:string) {

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  return data?.summary
}
