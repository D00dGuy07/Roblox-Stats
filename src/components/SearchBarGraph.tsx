import { RobloxFrontPage } from "@/robloxAPI"
import { SearchResult } from "@/search"
import { useState } from "react"

type SearchBarGraphProps = {
	result: SearchResult
	frontPage: RobloxFrontPage
}

export default function SearchBarGraph({ result, frontPage }: SearchBarGraphProps) {
	const [isHovering, setIsHovering] = useState(false)

	const fillerStyle = {
		height: `${result.occurences.length / frontPage.AllGames.length * 50}vh`
	}

	return <div
		className="flex flex-row gap-2"
		onMouseLeave={() => setIsHovering(false)}
	>
		<div id={result.term} className=" flex flex-col-reverse">
			<div 
				className=" w-20 flex flex-col-reverse"
				onMouseEnter={() => setIsHovering(true)}
			>
				<h1 className="text-xl text-clip text-center font-texts text-text-light dark:text-text-dark">{result.term}</h1>
				<div style={fillerStyle} className={`bg-primary-dark w-full rounded`} />
			</div>
		</div>

		<div style={{width: ((isHovering && result.occurences.length > 0) ? "15rem" : "0rem")}} className="h-[50vh] transition-[width] duration-500 flex flex-col-reverse">
			<div 
				style={{padding: ((isHovering && result.occurences.length > 0) ? "0.5rem" : "0")}} 
				className="overflow-y-auto overflow-x-hidden max-h-full rounded grid grid-cols-3 gap-2 transition-[padding] duration-500 bg-background-light-6dp dark:bg-background-dark-6dp"
			>
				{result.occurences.map((game) => {
					return <a key={game.placeId} href={`https://www.roblox.com/games/${game.placeId}`} target="_blank" className=" relative">
						<img 
							className="rounded"
							src={frontPage.Thumbnails.get(game.universeId) as string}
							alt={game.name}
						/>
						<div className=" float-left absolute top-0 left-0 w-full h-full p-1 overflow-hidden rounded opacity-0 hover:opacity-80 transition-opacity duration-300 bg-accent-light dark:bg-accent-dark">
							<p className=" text-xs font-texts font-semibold overflow-hidden text-text-dark dark:text-text-light">{game.name}</p>
						</div>
					</a>
				})}
			</div>
		</div>
	</div>
}