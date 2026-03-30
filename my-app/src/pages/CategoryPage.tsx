import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import RecipeGrid from '../components/RecipeGrid'

//Databas supabase och typ för recepten
import { supabase } from '../supabaseClient'
import { Recipe } from '../types'

interface CategoryPageProps {
  category: string
  title: string
  heroImage: string
}

export default function CategoryPage({ category, title, heroImage }: CategoryPageProps) {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('category', category) // Dynamiskt filter!
          .order('created_at', { ascending: false })

        if (error) throw error
        setRecipes(data || [])
      } catch (error) {
        console.error(`Error fetching ${category}:`, error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [category]) // Viktigt: useEffect körs om när kategorin ändras

  const formattedRecipes: Recipe[] = recipes.map(r => ({
    id: r.id,
    name: r.name,
    image: r.image_url || '/placeholder.jpg',
    time: `${r.cooking_time} min`,
    servings: 4,
    description: r.description 
  }))

  return (
    <>
      <Hero title={title} image={heroImage} />
      <main>
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <RecipeGrid recipes={formattedRecipes} />
        )}
      </main>
    </>
  )
}