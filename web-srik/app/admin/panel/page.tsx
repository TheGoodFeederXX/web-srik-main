"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, ArrowLeft, ImagePlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FileInput } from "@/components/ui/file-input"
import { uploadFiles } from '@/lib/media-service'

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    title: "Program Tahfiz Al-Quran",
    excerpt:
      "Program hafazan Al-Quran untuk pelajar yang berminat menghafaz Al-Quran dengan bimbingan guru tahfiz yang berkelayakan.",
    content:
      "Program Tahfiz Al-Quran di Sekolah Rendah Islam Al-Khairiah bertujuan untuk melahirkan generasi huffaz yang berakhlak mulia dan cemerlang dalam akademik. Program ini dikendalikan oleh guru-guru tahfiz yang berkelayakan dan berpengalaman dalam bidang hafazan Al-Quran.\n\nPelajar akan dibimbing untuk menghafaz Al-Quran mengikut kaedah yang berkesan dan sistematik. Selain itu, pelajar juga akan diajar tentang tajwid, tafsir dan adab-adab berinteraksi dengan Al-Quran.",
    image: "/placeholder.svg?height=600&width=800",
    date: "2023-05-15",
    status: "published",
  },
  {
    id: 2,
    title: "Program Bahasa Arab",
    excerpt: "Program pembelajaran Bahasa Arab untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar.",
    content:
      "Program Bahasa Arab di Sekolah Rendah Islam Al-Khairiah bertujuan untuk meningkatkan kemahiran berbahasa Arab dalam kalangan pelajar. Program ini merangkumi pembelajaran tatabahasa Arab, perbualan, penulisan dan pembacaan.\n\nPelajar akan didedahkan dengan kaedah pembelajaran yang interaktif dan menyeronokkan untuk menguasai Bahasa Arab. Aktiviti seperti pertandingan bercerita, syair dan nasyid dalam Bahasa Arab turut diadakan untuk meningkatkan minat dan keyakinan pelajar dalam menggunakan Bahasa Arab.",
    image: "/placeholder.svg?height=600&width=800",
    date: "2023-06-20",
    status: "published",
  },
  {
    id: 3,
    title: "Program Sukan dan Rekreasi",
    excerpt: "Program sukan dan rekreasi untuk memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan pelajar.",
    content:
      "Program Sukan dan Rekreasi di Sekolah Rendah Islam Al-Khairiah bertujuan untuk memupuk semangat kesukanan dan gaya hidup sihat dalam kalangan pelajar. Program ini merangkumi pelbagai aktiviti sukan seperti bola sepak, bola jaring, badminton, ping pong dan sebagainya.\n\nSelain itu, aktiviti rekreasi seperti perkhemahan, eksplorasi alam dan aktiviti luar turut diadakan untuk membina kecergasan fizikal, mental dan sosial pelajar. Program ini juga bertujuan untuk memupuk nilai-nilai murni seperti semangat berpasukan, disiplin dan ketahanan diri.",
    image: "/placeholder.svg?height=600&width=800",
    date: "2023-07-10",
    status: "draft",
  },
]

// Mock data for gallery
const initialGallery = [
  {
    id: 1,
    title: "Aktiviti 1",
    caption: "Program Tahfiz Al-Quran",
    image: "/placeholder.svg?height=600&width=800",
    category: "aktiviti",
  },
  {
    id: 2,
    title: "Aktiviti 2",
    caption: "Program Bahasa Arab",
    image: "/placeholder.svg?height=600&width=800",
    category: "program",
  },
]

export default function AdminPanel() {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [gallery, setGallery] = useState(initialGallery)
  const [currentImage, setCurrentImage] = useState({
    id: 0,
    title: "",
    caption: "",
    image: "",
    images: [] as string[],
    category: "aktiviti",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false)
  const [isDeleteImageDialogOpen, setIsDeleteImageDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState({
    id: 0,
    title: "",
    excerpt: "",
    content: "",
    image: "",
    date: "",
    status: "draft",
  })
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleAddPost = () => {
    const newPost = {
      ...currentPost,
      id: posts.length > 0 ? Math.max(...posts.map((post) => post.id)) + 1 : 1,
      date: new Date().toISOString().split("T")[0],
    }
    setPosts([...posts, newPost])
    setIsAddDialogOpen(false)
    resetCurrentPost()
  }

  const handleEditPost = () => {
    const updatedPosts = posts.map((post) => (post.id === currentPost.id ? currentPost : post))
    setPosts(updatedPosts)
    setIsEditDialogOpen(false)
    resetCurrentPost()
  }

  const handleDeletePost = () => {
    const filteredPosts = posts.filter((post) => post.id !== currentPost.id)
    setPosts(filteredPosts)
    setIsDeleteDialogOpen(false)
    resetCurrentPost()
  }
  const handleAddImage = () => {
    const newImage = {
      id: gallery.length > 0 ? Math.max(...gallery.map((image) => image.id)) + 1 : 1,
      title: currentImage.title,
      caption: currentImage.caption,
      image: currentImage.image || (currentImage.images.length > 0 ? currentImage.images[0] : ""),
      category: currentImage.category,
    }
    setGallery([...gallery, newImage])
    setIsAddImageDialogOpen(false)
    resetCurrentImage()
  }

  const handleDeleteImage = () => {
    const filteredGallery = gallery.filter((image) => image.id !== currentImage.id)
    setGallery(filteredGallery)
    setIsDeleteImageDialogOpen(false)
    resetCurrentImage()
  }

  const handleFileSelect = async (files: File[]) => {
    setUploadingFiles(files)
  }

  const uploadFiles = async () => {
    setIsUploading(true)
    
    try {
      const responses = await uploadFiles(uploadingFiles)
      const successfulUploads = responses
        .filter(response => response.success && response.urls)
        .map(response => response.urls!.original)

      setCurrentImage(prev => ({
        ...prev,
        images: [...prev.images, ...successfulUploads]
      }))
    } catch (error) {
      console.error('Error uploading files:', error)
      // You might want to show an error toast here
    } finally {
      setIsUploading(false)
      setUploadingFiles([])
    }
  }

  useEffect(() => {
    if (uploadingFiles.length > 0) {
      uploadFiles()
    }
  }, [uploadingFiles])

  const resetCurrentPost = () => {
    setCurrentPost({
      id: 0,
      title: "",
      excerpt: "",
      content: "",
      image: "",
      date: "",
      status: "draft",
    })
  }
  
  const resetCurrentImage = () => {
    setCurrentImage({
      id: 0,
      title: "",
      caption: "",
      image: "",
      images: [],
      category: "aktiviti",
    })
  }
  const openEditDialog = (post) => {
    setCurrentPost(post)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (post) => {
    setCurrentPost(post)
    setIsDeleteDialogOpen(true)
  }

  const openDeleteImageDialog = (image) => {
    setCurrentImage(image)
    setIsDeleteImageDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Laman Utama
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-emerald-800">Panel Admin</h1>
          <p className="text-gray-600 mt-2">Urus kandungan laman web Sekolah Rendah Islam Al-Khairiah</p>
        </motion.div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Post</TabsTrigger>
            <TabsTrigger value="galeri">Galeri</TabsTrigger>
            <TabsTrigger value="settings">Tetapan</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Senarai Post</CardTitle>
                  <CardDescription>Urus post untuk laman web sekolah</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Tambah Post Baru</DialogTitle>
                      <DialogDescription>Isi maklumat untuk menambah post baru ke laman web.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Tajuk</Label>
                        <Input
                          id="title"
                          value={currentPost.title}
                          onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                          placeholder="Tajuk post"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="excerpt">Ringkasan</Label>
                        <Textarea
                          id="excerpt"
                          value={currentPost.excerpt}
                          onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                          placeholder="Ringkasan post"
                          rows={2}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Kandungan</Label>
                        <Textarea
                          id="content"
                          value={currentPost.content}
                          onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                          placeholder="Kandungan post"
                          rows={6}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="image">URL Imej</Label>
                        <Input
                          id="image"
                          value={currentPost.image}
                          onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                          placeholder="/placeholder.svg?height=600&width=800"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          value={currentPost.status}
                          onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="draft">Draf</option>
                          <option value="published">Diterbitkan</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAddPost}>
                        Simpan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tajuk</TableHead>
                      <TableHead>Tarikh</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.id}</TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status === "published" ? "Diterbitkan" : "Draf"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(post)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="galeri">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Galeri</CardTitle>
                  <CardDescription>Urus gambar galeri untuk laman web sekolah</CardDescription>
                </div>
                <Dialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Gambar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Tambah Gambar Baru</DialogTitle>
                      <DialogDescription>
                        Tambah gambar baru ke dalam galeri. Gambar akan dipaparkan di halaman utama.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Gambar</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {currentImage.images.map((image, index) => (
                            <div
                              key={image}
                              className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200 dark:border-gray-800"
                            >
                              <Image
                                src={image}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCurrentImage(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 6L6 18M6 6l12 12"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                          <div
                            onClick={() => document.getElementById('gallery-upload')?.click()}
                            className="relative flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900"
                          >
                            <div className="text-center">
                              <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Klik untuk memilih gambar
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG, GIF sehingga 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="gallery-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            if (files.length > 0) {
                              handleFileSelect(files)
                            }
                          }}
                          accept="image/*"
                          multiple
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tajuk</Label>
                        <Input
                          placeholder="Masukkan tajuk gambar"
                          value={currentImage.title}
                          onChange={e =>
                            setCurrentImage(prev => ({ ...prev, title: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Keterangan</Label>
                        <Textarea
                          placeholder="Masukkan keterangan gambar"
                          value={currentImage.caption}
                          onChange={e =>
                            setCurrentImage(prev => ({ ...prev, caption: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategori</Label>
                        <select
                          className="w-full px-3 py-2 bg-background border border-input rounded-md"
                          value={currentImage.category}
                          onChange={e =>
                            setCurrentImage(prev => ({ ...prev, category: e.target.value }))
                          }
                        >
                          <option value="aktiviti">Aktiviti</option>
                          <option value="program">Program</option>
                          <option value="fasiliti">Fasiliti</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        disabled={isUploading}
                        onClick={() => setIsAddImageDialogOpen(false)}
                        variant="outline"
                      >
                        Batal
                      </Button>
                      <Button
                        disabled={isUploading}
                        onClick={() => {
                          const newImages = currentImage.images.map((image, index) => ({
                            id: Date.now() + index,
                            title: `${currentImage.title} ${index + 1}`,
                            caption: currentImage.caption,
                            image: image,
                            category: currentImage.category,
                          }))
                          
                          setGallery(prev => [...prev, ...newImages])
                          setIsAddImageDialogOpen(false)
                          setCurrentImage({
                            id: 0,
                            title: "",
                            caption: "",
                            images: [],
                            category: "aktiviti",
                          })
                        }}
                      >
                        {isUploading ? 'Memuat naik...' : 'Tambah'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={image.image}
                          alt={`Gallery image ${image.title}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white text-red-500"
                            onClick={() => openDeleteImageDialog(image)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium">{image.title}</p>
                        <p className="text-sm text-gray-500">Kategori: {image.category}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 bg-emerald-50">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">
                      3
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </nav>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Tetapan</CardTitle>
                <CardDescription>Urus tetapan laman web</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Tetapan laman web akan ditambah kemudian.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>Kemaskini maklumat post.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Tajuk</Label>
                <Input
                  id="edit-title"
                  value={currentPost.title}
                  onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-excerpt">Ringkasan</Label>
                <Textarea
                  id="edit-excerpt"
                  value={currentPost.excerpt}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Kandungan</Label>
                <Textarea
                  id="edit-content"
                  value={currentPost.content}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">URL Imej</Label>
                <Input
                  id="edit-image"
                  value={currentPost.image}
                  onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={currentPost.status}
                  onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Draf</option>
                  <option value="published">Diterbitkan</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleEditPost}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Padam Post</DialogTitle>
              <DialogDescription>
                Adakah anda pasti untuk memadam post ini? Tindakan ini tidak boleh dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                Padam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Image Dialog */}
        <Dialog open={isDeleteImageDialogOpen} onOpenChange={setIsDeleteImageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Padam Gambar</DialogTitle>
              <DialogDescription>
                Adakah anda pasti untuk memadam gambar ini? Tindakan ini tidak boleh dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteImageDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteImage}>
                Padam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// No need to redefine setCurrentImage as it's already defined by useState
// This was likely added accidentally during development
