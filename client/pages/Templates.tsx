import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Package,
  Shirt,
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  Edit,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  type: "frente" | "verso" | "manga";
  category: "basico" | "sport" | "premium" | "custom";
  sizes: string[];
  preview: string;
  description: string;
  rating: number;
  downloads: number;
  favorite: boolean;
  createdAt: string;
}

const templates: Template[] = [
  {
    id: "t1",
    name: "Básica Frente",
    type: "frente",
    category: "basico",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description:
      "Molde básico para aplicação frontal com área central para arte",
    rating: 4.5,
    downloads: 245,
    favorite: true,
    createdAt: "2024-01-10",
  },
  {
    id: "t2",
    name: "Sport Pro Frente",
    type: "frente",
    category: "sport",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description:
      "Molde esportivo com área ampliada para logos e patrocinadores",
    rating: 4.8,
    downloads: 189,
    favorite: false,
    createdAt: "2024-01-12",
  },
  {
    id: "t3",
    name: "Premium Frente",
    type: "frente",
    category: "premium",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde premium com múltiplas áreas para aplicação",
    rating: 4.9,
    downloads: 156,
    favorite: true,
    createdAt: "2024-01-08",
  },
  {
    id: "t4",
    name: "Básica Verso",
    type: "verso",
    category: "basico",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde básico para aplicação nas costas",
    rating: 4.3,
    downloads: 203,
    favorite: false,
    createdAt: "2024-01-09",
  },
  {
    id: "t5",
    name: "Sport Pro Verso",
    type: "verso",
    category: "sport",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde esportivo para costas com área para nome e número",
    rating: 4.7,
    downloads: 167,
    favorite: true,
    createdAt: "2024-01-11",
  },
  {
    id: "t6",
    name: "Manga Esquerda",
    type: "manga",
    category: "basico",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde para aplicação na manga esquerda",
    rating: 4.2,
    downloads: 98,
    favorite: false,
    createdAt: "2024-01-07",
  },
  {
    id: "t7",
    name: "Manga Direita Sport",
    type: "manga",
    category: "sport",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde esportivo para manga direita com área para patrocínio",
    rating: 4.4,
    downloads: 134,
    favorite: false,
    createdAt: "2024-01-13",
  },
  {
    id: "t8",
    name: "Custom Personalizado",
    type: "frente",
    category: "custom",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"],
    preview: "/placeholder.svg",
    description: "Molde personalizado criado pelo usuário",
    rating: 5.0,
    downloads: 67,
    favorite: true,
    createdAt: "2024-01-14",
  },
];

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "all" || template.type === selectedType;
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "downloads":
          return b.downloads - a.downloads;
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getCategoryColor = (category: Template["category"]) => {
    switch (category) {
      case "basico":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "sport":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "custom":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category: Template["category"]) => {
    switch (category) {
      case "basico":
        return "Básico";
      case "sport":
        return "Sport";
      case "premium":
        return "Premium";
      case "custom":
        return "Personalizado";
      default:
        return "Desconhecido";
    }
  };

  const toggleFavorite = (templateId: string) => {
    // Implementar toggle de favorito
    console.log("Toggle favorite:", templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                  Catálogo de Moldes
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredTemplates.length} molde
                  {filteredTemplates.length !== 1 ? "s" : ""} disponível
                  {filteredTemplates.length !== 1 ? "eis" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Molde
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Molde
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Busca */}
        <Card className="border-0 shadow-md mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Busca */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar moldes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por Tipo */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="frente">Frente</SelectItem>
                  <SelectItem value="verso">Verso</SelectItem>
                  <SelectItem value="manga">Manga</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Categoria */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>

              {/* Ordenação */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Avaliação</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                </SelectContent>
              </Select>

              {/* Modo de Visualização */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-primary hover:bg-primary/90" : ""
                  }
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-primary hover:bg-primary/90" : ""
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Moldes */}
        {filteredTemplates.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Nenhum molde encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedCategory("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative rounded-t-lg overflow-hidden">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getCategoryColor(template.category)}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(template.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${template.favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="flex-1 bg-white/90 text-gray-900 hover:bg-white"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{template.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">
                                  {template.name}
                                </h3>
                                <p className="text-gray-600">
                                  {template.description}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tipo:</span>
                                  <span className="capitalize">
                                    {template.type}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Categoria:
                                  </span>
                                  <Badge
                                    className={getCategoryColor(
                                      template.category,
                                    )}
                                  >
                                    {getCategoryLabel(template.category)}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Avaliação:
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{template.rating}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Downloads:
                                  </span>
                                  <span>{template.downloads}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Tamanhos:
                                  </span>
                                  <span>{template.sizes.join(", ")}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2 pt-4">
                                <Button className="flex-1 bg-primary hover:bg-primary/90">
                                  <Download className="w-4 h-4 mr-2" />
                                  Usar Molde
                                </Button>
                                <Button variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{template.downloads}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      index !== filteredTemplates.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {template.name}
                          </h3>
                          <Badge
                            className={getCategoryColor(template.category)}
                          >
                            {getCategoryLabel(template.category)}
                          </Badge>
                          {template.favorite && (
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{template.type}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{template.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{template.downloads}</span>
                          </div>
                          <span>{template.sizes.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Usar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
