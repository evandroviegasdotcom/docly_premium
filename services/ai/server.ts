"use server"

const endpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/summarize`
export async function summarizeFile(url:string, summarySize: "small" | "medium" | "large") {

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, summarySize }),
  });
  const data = await response.json();
  return data?.summary
}
