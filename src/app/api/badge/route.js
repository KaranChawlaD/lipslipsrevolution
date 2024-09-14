export async function GET(req) {
    console.log(req)
    const {searchParams} = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
        return new Response(JSON.stringify({ok: false, error: "Missing query param `code`"}), { status: 400 });
  }
  const name = await getName(code);
  if (!name) {
    return new Response(JSON.stringify({ok: false, error: "Invalid badge code"}), { status: 400 });
  }
  const result = {
    ok: true,
    name,
  };
  return new Response(JSON.stringify(result), { status: 200 });
}

async function getName(code) {
    const token = process.env.HTN_TOKEN;

    if (code == "support-wod-might-cook") {
        return "Lucas Jin";
    }

    const resp = await fetch("https://api.hackthenorth.com/v3/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization": `${token}` 
        },
        body: JSON.stringify({
          query: `
            mutation HandleNetworkingScan {
              handleNetworkingScan(badge_code: "${code}") {
                hackerNetworkingPayload {
                  name
                }
              }
            }
          `
        }),
      })
    
    const data = await resp.json();
    const name = data?.data?.handleNetworkingScan?.hackerNetworkingPayload?.name;
    return name;
}