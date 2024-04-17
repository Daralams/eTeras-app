import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

function CategorySection () {
  const [categories, setCategories] = useState([])
  
  useEffect(() => {
    getCategoryName()
  }, [])
  
  const getCategoryName = async () => {
    const response = await axios.get("http://localhost:3000/category")
    setCategories(response.data[1].data)
  }
  
  return (
    <div className="bg-slate-200">
      <div className="py-3 px-8">
        <ul className="flex flex-wrap justify-center gap-4">
        {categories.map(category => (
           <li className="hover:text-red-500" key={category.id}>
             <Link to={`/category/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    )
}

export default CategorySection