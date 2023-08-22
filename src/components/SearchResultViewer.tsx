import { RobloxFrontPage } from "@/robloxAPI"
import { SearchResult } from "@/search"
import SearchBarGraph from "./SearchBarGraph"

type SearchResultViewerProps = {
	results: SearchResult[]
	frontPage: RobloxFrontPage
}

export default function SearchResultViewer({ results, frontPage }: SearchResultViewerProps) {
	return <div 
		className="mb-4 p-6 rounded-3xl bg-background-light-2dp dark:bg-background-dark-2dp"
	>
		<div className="overflow-y-hidden overflow-x-auto flex flex-row p-4 gap-2">
			{results.map((result) => {
				return <SearchBarGraph key={result.id} result={result} frontPage={frontPage as RobloxFrontPage}/>
			})}
		</div>
	</div>
}