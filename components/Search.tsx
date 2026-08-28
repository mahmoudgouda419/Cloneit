"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = React.useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handelClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
    <div className={"search"}>
      <div className={"search-input-wrapper"}>
        <Image
          src={"/assets/icons/search.svg"}
          alt={"Search"}
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder={"search..."}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        {open && (
          <ul className={"search-result"}>
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  onClick={() => handelClickItem(file)}
                  className={"flex items-center justify-between"}
                >
                  <div className={"flex cursor-pointer items-center gap-4"}>
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className={"size-9 min-w-9"}
                    />
                    <p className={"subtitle-2 line-clamp-1 text-light-100"}>
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className={"caption line-clamp-1 text-light-200"}
                  />
                </li>
              ))
            ) : (
              <p className={"empty-result"}>No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Search;
