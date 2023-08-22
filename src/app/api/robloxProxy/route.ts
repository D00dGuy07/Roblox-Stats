import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers"

function manipulateHeaders(responseHeaders: Headers, redirectCookies: boolean) {
	const returnHeaders = new Headers();
	responseHeaders.forEach((value, key, parent) => {
		if (key.toLowerCase() === "set-cookie" && redirectCookies)
		{
			const attributes = value.split("; ").filter((value, index, array) => !(value.toLowerCase().startsWith("domain"))).join("; ")
			returnHeaders.append(key, attributes)
		}
		else if (key.toLowerCase() !== "content-encoding")
		{
			returnHeaders.append(key, value)
		}
	})

	return returnHeaders
}

export async function GET(request: NextRequest) {
	// Get the headers and make sure that there is a destination
	const headersList = headers();
	const destination = request.nextUrl.searchParams.get("destination")
	const shouldRedirectCookies = request.nextUrl.searchParams.get("redirectCookies")
	const shouldIncludeCookies = request.nextUrl.searchParams.get("includeCookies")
	if (destination === null) { return new NextResponse(null, {status: 400}) }
	
	// Build a new request using the important provided headers
	const finalHeaders = new Headers()

	if (headersList.has("Content-Type")) finalHeaders.set("Content-Type", headersList.get("Content-Type") as string)
	if (headersList.has("Accept")) finalHeaders.set("Accept", headersList.get("Accept") as string)
	if (headersList.has("Cookie") && shouldIncludeCookies === "true") finalHeaders.set("Cookie", headersList.get("Cookie") as string)
	
	// Execute the request
	var response = await fetch(decodeURI(destination), {
		method: "GET",
		headers: finalHeaders,
	})

	// Get rid of the domain property of cookies
	var returnHeaders: Headers = manipulateHeaders(response.headers, shouldRedirectCookies === "true")

	return new Response(response.body, {
		headers: returnHeaders,
		status: response.status
	})
}

export interface PostProps {
	destination: string
	redirectCookies: boolean
	includeCookies: boolean
	data: any
}

export async function POST(request: NextRequest) {
	var body: PostProps;
	try {
		body = await request.json() as PostProps
	} catch(e) { return new NextResponse(null, {status: 400})}

	const headersList = headers();
	const finalHeaders = new Headers()
	if (headersList.has("Content-Type")) finalHeaders.set("Content-Type", headersList.get("Content-Type") as string)
	if (headersList.has("Accept")) finalHeaders.set("Accept", headersList.get("Accept") as string)
	if (headersList.has("Cookie") && body.includeCookies == true) finalHeaders.set("Cookie", headersList.get("Cookie") as string)

	// Execute the request
	var response = await fetch(decodeURI(body.destination), {
		method: "POST",
		headers: finalHeaders,
		body: JSON.stringify(body.data)
	})

	// Get rid of the domain property of cookies
	var returnHeaders: Headers = manipulateHeaders(response.headers, body.redirectCookies)

	return new Response(response.body, {
		headers: returnHeaders,
		status: response.status
	})
}