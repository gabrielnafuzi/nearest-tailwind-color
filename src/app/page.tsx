import { NearestColorForm } from './nearest-color-form'

export default function Home() {
  return (
    <main className="p-4 w-full">
      <h1 className="text-center text-2xl">Find nearest tailwindcss color</h1>

      <div className="mt-12">
        <NearestColorForm />
      </div>
    </main>
  )
}
