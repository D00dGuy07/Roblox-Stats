import { v4 as uuidv4 } from "uuid";
import { GameInformation, RobloxFrontPage } from "./robloxAPI"

export type SearchResult = {
	term: string
	occurences: GameInformation[]
	id: string
}

function Search(frontPage: RobloxFrontPage, term: string): SearchResult {
	var result: SearchResult = {
		term: term,
		occurences: [],
		id: uuidv4()
	}

	// Here is where I can really make this site interesting but for now I'll leave it like this
	const lowerCaseTerm = term.toLowerCase()	
	frontPage.AllGames.forEach(game => {
		if (game.name.toLowerCase().indexOf(lowerCaseTerm) !== -1 || game.gameDescription.toLowerCase().indexOf(lowerCaseTerm) !== -1)
			result.occurences.push(game)
	});

	return result
}

export function SearchFrontPage(frontPage: RobloxFrontPage, terms: string[]): SearchResult[]
{
	var results: SearchResult[] = []
	terms.forEach((term) => results.push(Search(frontPage, term)))

	return results
}