import { fetchWithTimeout } from "@/utils";

/**
 * Fetch home data from "/user/home"
 */
export async function fetchHomeData({ userId = "matt" }: any) {
  if (!prompt) {
    console.log("No prompt, handle error");
    return;
  }
  try {
    const response = await fetchWithTimeout("/api/user/home", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;

    console.log("fetchHomeData", data);

    if (!data) {
      return;
    }
  } catch (err) {
    console.log(err);
  }
}
