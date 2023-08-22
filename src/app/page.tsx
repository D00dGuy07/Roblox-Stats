"use client"

import { useState } from "react";
import { GetRobloxFrontPage, RobloxFrontPage } from "@/robloxAPI";
import { SearchFrontPage, SearchResult } from "@/search";
import SearchResultViewer from "@/components/SearchResultViewer";
import useSWR from "swr";

const fetcher = async () => {
  var result: RobloxFrontPage | undefined | null

  // Fetching should be retried a maximum of 3 times before erroring
  for (let i = 0; i < 3; i++) {
    result = await GetRobloxFrontPage().catch((error) => undefined)
    if (result != undefined) break

    // If it fails then wait one second and try again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return result
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResult[] | null>(null)

  const { data, error, isLoading, isValidating } = useSWR<RobloxFrontPage | undefined | null>("roblox data", fetcher, {onSuccess(data, key, config) {
    // If there is a search already displayed then update it with the new data
    if (currentSearchResults != null)
    {
      // There isn't really a pretty way to get the terms like this with how I designed everything
      var currentQuery: string[] = []
      currentSearchResults?.forEach((result) => currentQuery.push(result.term))

      setCurrentSearchResults(SearchFrontPage(data as RobloxFrontPage, currentQuery))
    }
  },})

  // This really shouldn't happen
  if (error) return <body className="flex flex-col items-center mx-16 p-8 bg-background-light dark:bg-background-dark">
      <h1 className="text-5xl m-16 font-medium font-headings text-text-light dark:text-text-dark ">
        Failed To Load
      </h1>
  </body>

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading || currentQuery.length < 1) return; // Don't try to search until the data is actually there

    // Separate terms by comma and remove any leading/trailing whitespace
    var query = currentQuery.split(',');
    query.forEach((term, i) => {query[i] = term.trimStart().trimEnd()})

    setCurrentSearchResults(SearchFrontPage(data as RobloxFrontPage, query))
  }

  function loadingCircle(message: string) {
    // This svg is for the spinning circle graphic
    return <div className="flex flex-row items-center gap-4 justify-center mt-16">
      <svg 
        width="48" 
        height="48"
        viewBox="0 0 512 512"
        className="!fill-accent-light dark:!fill-accent-dark animate-spin"
      >
        <path d="M304 48a48 48 0 1 0-96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0-96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0-96 0 48 48 0 1 0 96 0zM142.9 437A48.013 48.013 0 1 0 75 369.1a48.013 48.013 0 1 0 67.9 67.9zm0-294.2A48 48 0 1 0 75 75a48.013 48.013 0 1 0 67.9 67.9zM369.1 437a48.013 48.013 0 1 0 67.9-67.9 48.013 48.013 0 1 0-67.9 67.9z"/>
      </svg>
      <h2 className="text-xl font-texts font-medium text-center text-text-light dark:text-text-dark">{message}</h2>
    </div>
  }

  return <body className="mx-16 p-8 bg-background-light dark:bg-background-dark">
    <header className="flex flex-col mb-4 p-4">
      <div className="flex flex-col items-center ">
        <h1 className="text-5xl mb-4 font-medium font-headings text-text-light dark:text-text-dark ">
          Roblox Statistics
        </h1>

        <form onSubmit={handleSearch} className="flex flex-row w-3/4 gap-2">
          <label 
            htmlFor="queryBar" 
            className="flex items-center font-texts text-text-light dark:text-text-dark"
          >Query: </label>
          <input 
            value={currentQuery} 
            onChange={e => setCurrentQuery(e.target.value)} 
            id="queryBar" 
            type="text" 
            className="rounded focus:outline-none p-2 flex-grow font-texts text-text-light bg-secondary-light dark:text-text-dark dark:bg-secondary-dark"
            placeholder="ex: 'anime' or 'car, vehicle'"
          />
          <button 
            className="rounded p-2 font-texts text-text-light bg-primary-light"
            type="submit"
          >Search</button>
        </form>
      </div>
    </header>

    {(data !== null && currentSearchResults !== null) && <SearchResultViewer 
      results={currentSearchResults} 
      frontPage={data as RobloxFrontPage}
    />}

    {isLoading && loadingCircle("Loading")}
    {(isValidating && !isLoading) && loadingCircle("Reloading")}
  </body>
}