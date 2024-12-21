import { useSQLiteContext } from "expo-sqlite"
import { createContext, ReactNode, useEffect, useState } from "react"

interface IProps {
    children: ReactNode
}

export type BookType = {
    id: number,
    title: string,
    author: string,
    uri: string,
    currentPage: number
}

export const BookContext = createContext<
    {
        books: BookType[]
        setBooks: React.Dispatch<React.SetStateAction<{
        id: number,
        title: string,
        author: string,
        uri: string,
        currentPage: number}[]>>
}>({
        books: [],
        setBooks: () => null
    })

export const BookContextProvider = ({children}: IProps) => {
    const [books, setBooks] = useState< {
        id: number,
        title: string,
        author: string,
        uri: string,
        currentPage: number
    }[]>([])

        const db = useSQLiteContext()
      
        useEffect(() => {
            const getBooks = async () => {
                try {
                  const books = await db.getAllAsync(`
                    SELECT * FROM books
                    `)
              
                    //@ts-ignore
                    setBooks(books)

                    const bookshelves = await db.getAllAsync(`
                        SELECT * FROM bookshelves_books
                        `)

                        console.log("Bookshelves: ", bookshelves)
                } catch (error) {
                  
                }
              }

          getBooks()
        }, [])

    return (
        <BookContext.Provider value={{
            books,
            setBooks: setBooks
        }}>
            {children}
        </BookContext.Provider>
    )


}