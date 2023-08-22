import { PostProps } from "./app/api/robloxProxy/route"

const DISCOVER_ADDRESS = "/api/robloxProxy?redirectCookies=true&destination=https://www.roblox.com/discover"
export async function PingDiscover(): Promise<void> {
	// I really don't know why this is happening but the server console is saying it's undefined
	if (document === undefined) return

	// Clear the cookies because for some reason that keeps messing up the requests
	document.cookie.split(";").forEach((cookie) => {
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
		document.cookie = name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
	})

	// Send the request just to get the cookies
	await fetch(DISCOVER_ADDRESS, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	})
}

export interface SortToken {
	token: string
	name: string
	displayName: string
	gameSetTypeId: number
	gameSetTargetId: number
	timeOptionsAvailable: boolean
	genreOptionsAvailable: true
	numberOfRows: number
	numberOfGames: number
	isDefaultSort: boolean
	contextUniverseId: number
	contextCountryRegionId: number
	tokenExpiryInSeconds: number
}

export interface TimeFilter {
	token: string
	name: string
	tokenExpiryInSeconds: number
}

export interface GenreFilter {
	token: string
	name: string
	tokenExpiryInSeconds: number
}

export interface GameFilter {
	token: string
	name: string
	tokenExpiryInSeconds: number
}

export interface PageContext {
	pageId: string
	isSeeAllPages: boolean
}

export interface GameSortsResponse {
	sorts: SortToken[]
	timeFilters: TimeFilter[]
	genreFilters: GenreFilter[]
	gameFilters: GameFilter[]
	pageContext: PageContext
	gameSortStyle: string
}

const SORT_TOKENS_ADDRESS = "/api/robloxProxy?redirectCookies=true&includeCookies=true&destination=https://games.roblox.com/v1/games/sorts?GameSortsContext=0"
export async function GetSortTokens(): Promise<GameSortsResponse> {
	// Create the headers
	const headers = new Headers()
	headers.set("Content-Type", "application/json")
	headers.set("Accept", "application/json")

	// Send the request and decode the response
	const response = await fetch(SORT_TOKENS_ADDRESS, {
		method: "GET",
		headers: headers,
	})

	const json = await response.json()
	return json as GameSortsResponse
}

export interface GameInformation {
	creatorId: number
	creatorName: string
	creatorType: string
	creatorHasVerifiedBadge: boolean
	totalUpVotes: number
	totalDownVotes: number
	universeId: number
	name: string
	placeId: number
	playerCount: number
	imageToken: string
	isSponsored: boolean
	nativeAdData: string
	isShowSponsoredLabel: boolean
	price: number
	analyticsIdentifier: string
	gameDescription: string
	genre: string
	minimumAge: number
	ageRecommendationDisplayName: string
}

export interface EsDebugInfo {
	esQuery: string
}

export interface GamesListResponse {
	games: GameInformation[]
	suggestedKeyword: string
	correctedKeyword: string
	filteredKeyword: string
	hasMoreRows: boolean
	nextPageExclusiveStartId: number
	featuredSearchUniverseId: number
	emphasis: boolean
	cutOffIndex: number
	algorithm: string
	algorithmQueryType: string
	suggestionAlgorithm: string
	relatedGames: GameInformation[]
	esDebugInfo: EsDebugInfo
}

export async function GetGamesList(token: SortToken, context: PageContext, sortPosition: number, timeFilter: TimeFilter | null = null): Promise<GamesListResponse> {
	// Build the URL
	var url = new URL("https://games.roblox.com/v1/games/list")
	url.searchParams.set("sortToken", token.token)
	if (token.gameSetTargetId !== null)
		url.searchParams.set("gameSetTargetId", token.gameSetTargetId.toString())
	url.searchParams.set("startRows", "0")
	url.searchParams.set("maxRows", "32")
	url.searchParams.set("hasMoreRows", "true")
	url.searchParams.set("sortPosition", sortPosition.toString())
	if (timeFilter != null)
		url.searchParams.set("timeFilter", timeFilter.token)
	url.searchParams.set("pageContext.pageId", context.pageId)
	
	// Create the headers
	const headers = new Headers()
	headers.set("Content-Type", "application/json")
	headers.set("Accept", "application/json")
	
	// Send the request and decode the response
	const encodedUrl = url.toString().replaceAll('?', "%3F").replaceAll('&', "%26")
	const response = await fetch(`/api/robloxProxy?redirectCookies=true&includeCookies=true&destination=${encodedUrl}`, {
		method: "GET",
		headers: headers,
	})

	const json = await response.json()
	return json as GamesListResponse
}

export interface ThumbnailResponse {
	requestId: string
	errorCode: number
	errorMessage: string
	targetId: number
	state: string
	imageUrl: string
}

export type ThumbnailPayload = {
	requestId: string
	type: string
	targetId: number
	token: string
	format: string
	size: string
}

export interface ThumbnailBatchResponse {
	data: ThumbnailResponse[]
}

export async function GetThumbnailBatch(gamesList: number[]): Promise<ThumbnailBatchResponse> {
	// Build the payload
	var payload: ThumbnailPayload[] = []
	gamesList.forEach((gameId) => {
		payload.push({
			requestId: `${gameId}::GameIcon:150x150:png:regular`,
			type: "GameIcon",
			targetId: gameId,
			token: "",
			format: "png",
			size: "150x150"
		})
	})

	const props: PostProps = {
		destination: "https://thumbnails.roblox.com/v1/batch",
		includeCookies: false,
		redirectCookies: false,
		data: payload
	}

	// Execute the request
	const response = await fetch("/api/robloxProxy", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(props)
	})

	// Parse and return the json
	const json = await response.json()
	return json as ThumbnailBatchResponse
}

export type RobloxFrontPage = {
	MostEngaging: GamesListResponse
	UpAndComing: GamesListResponse
	Popular: GamesListResponse
	TopRated: GamesListResponse
	FreePrivateServers: GamesListResponse
	LearnAndExplore: GamesListResponse
	Featured: GamesListResponse
	PopularAmongPremium: GamesListResponse
	TopEarning: GamesListResponse
	PeopleLove: GamesListResponse
	Roleplay: GamesListResponse
	Adventure: GamesListResponse
	Fighting: GamesListResponse
	Obby: GamesListResponse
	Tycoon: GamesListResponse
	Simulator: GamesListResponse

	AllGames: GameInformation[]

	Thumbnails: Map<number, string>
}

export async function GetRobloxFrontPage(): Promise<RobloxFrontPage> {
	// Cookies
	await PingDiscover()

	// I wish this whole function was as clean as these three lines
	const sortTokens = await GetSortTokens()
	const context = sortTokens.pageContext
	const pastWeekFilter = sortTokens.timeFilters.find((value) => value.name === "PastWeek")

	// The roblox website does all of these requests individually as well, but at least it's possible to do them in parallel
	const allGamesLists = await Promise.all([
		GetGamesList(sortTokens.sorts[0], context, 0),
		GetGamesList(sortTokens.sorts[1], context, 1),
		GetGamesList(sortTokens.sorts[2], context, 2),
		GetGamesList(sortTokens.sorts[3], context, 3, pastWeekFilter),

		GetGamesList(sortTokens.sorts[4], context, 4),
		GetGamesList(sortTokens.sorts[5], context, 5),
		GetGamesList(sortTokens.sorts[6], context, 6),
		GetGamesList(sortTokens.sorts[7], context, 7),

		GetGamesList(sortTokens.sorts[8], context, 8),
		GetGamesList(sortTokens.sorts[9], context, 9),
		GetGamesList(sortTokens.sorts[10], context, 10),
		GetGamesList(sortTokens.sorts[11], context, 11),

		GetGamesList(sortTokens.sorts[12], context, 12),
		GetGamesList(sortTokens.sorts[13], context, 13),
		GetGamesList(sortTokens.sorts[14], context, 14),
		GetGamesList(sortTokens.sorts[15], context, 15),
	])

	var returnValue: RobloxFrontPage = {
		MostEngaging: allGamesLists[0],
		UpAndComing: allGamesLists[1],
		Popular: allGamesLists[2],
		TopRated: allGamesLists[3],
		FreePrivateServers: allGamesLists[4],
		LearnAndExplore: allGamesLists[5],
		Featured: allGamesLists[6],
		PopularAmongPremium: allGamesLists[7],
		TopEarning: allGamesLists[8],
		PeopleLove: allGamesLists[9],
		Roleplay: allGamesLists[10],
		Adventure: allGamesLists[11],
		Fighting: allGamesLists[12],
		Obby: allGamesLists[13],
		Tycoon: allGamesLists[14],
		Simulator: allGamesLists[15],

		AllGames: [],
		Thumbnails: new Map()
	}

	// This function adds every game response and its associated information to the return object
	// Luckily the long part only runs once every 100 games
	var batchArgs: number[] = []
	function joinGamesList(game: GameInformation): Promise<void> {
		// Don't process duplicates
		if (!returnValue.Thumbnails.has(game.universeId))
		{
			// Add the game to all of the necessary state
			returnValue.Thumbnails.set(game.universeId, "")
			returnValue.AllGames.push(game)
			batchArgs.push(game.universeId)

			// Process each batch once it reaches 100 games
			if (batchArgs.length === 100)
			{
				const returnPromise = GetThumbnailBatch(batchArgs).then((response) => {
					response.data.forEach((thumbnail) => returnValue.Thumbnails.set(thumbnail.targetId, thumbnail.imageUrl))
				})
				batchArgs = []

				return returnPromise
			}
		}

		return Promise.resolve()
	}

	// Yeah just ignore this part here
	for (const game of returnValue.MostEngaging.games) { await joinGamesList(game) }
	for (const game of returnValue.UpAndComing.games) { await joinGamesList(game) }
	for (const game of returnValue.Popular.games) { await joinGamesList(game) }
	for (const game of returnValue.TopRated.games) { await joinGamesList(game) }
	for (const game of returnValue.FreePrivateServers.games) { await joinGamesList(game) }
	for (const game of returnValue.LearnAndExplore.games) { await joinGamesList(game) }
	for (const game of returnValue.Featured.games) { await joinGamesList(game) }
	for (const game of returnValue.PopularAmongPremium.games) { await joinGamesList(game) }
	for (const game of returnValue.TopEarning.games) { await joinGamesList(game) }
	for (const game of returnValue.PeopleLove.games) { await joinGamesList(game) }
	for (const game of returnValue.Roleplay.games) { await joinGamesList(game) }
	for (const game of returnValue.Adventure.games) { await joinGamesList(game) }
	for (const game of returnValue.Fighting.games) { await joinGamesList(game) }
	for (const game of returnValue.Obby.games) { await joinGamesList(game) }
	for (const game of returnValue.Tycoon.games) { await joinGamesList(game) }
	for (const game of returnValue.Simulator.games) { await joinGamesList(game) }

	// There might be a batch of less than one hundred left over that needs to be flushed manually
	if (batchArgs.length > 0)
	{
		const thumbnailResponse = await GetThumbnailBatch(batchArgs)
		thumbnailResponse.data.forEach((thumbnail) => returnValue.Thumbnails.set(thumbnail.targetId, thumbnail.imageUrl))
	}

	return returnValue
}