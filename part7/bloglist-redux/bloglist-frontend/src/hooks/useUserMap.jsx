import { useMemo } from 'react'

const useUserMap = (blogs) => {
  return useMemo(() => {
    if (!blogs) return []

    const userMap = new Map()

    blogs.forEach(blog => {
      const user = blog.user
      if (!user || !user.id) return // guard against bad data

      if (!userMap.has(user.id)) {
        userMap.set(user.id, { ...user, blogs: [blog] })
      } else {
        userMap.get(user.id).blogs.push(blog)
      }
    })

    return Array.from(userMap.values())
  }, [blogs])
}

export default useUserMap
