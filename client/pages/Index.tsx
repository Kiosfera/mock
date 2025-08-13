import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  FolderOpen, 
  Calendar, 
  Download, 
  Eye, 
  Copy,
  Shirt,
  Palette,
  Settings,
  FileImage,
  Package
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  artUrl: string;
  templateType: "frente" | "verso" | "manga";
  size: string;
  quantity: number;
  hasNumbers: boolean;
  hasNames: boolean;
  createdAt: string;
  lastExported?: string;
  status: "draft" | "completed" | "exported";
}

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Time Futebol Academia",
      artUrl: "/placeholder.svg",
      templateType: "frente",
      size: "G",
      quantity: 25,
      hasNumbers: true,
      hasNames: true,
      createdAt: "2024-01-15",
      lastExported: "2024-01-16",
      status: "exported"
    },
    {
      id: "2",
      name: "Logo Empresa XYZ",
      artUrl: "/placeholder.svg",
      templateType: "frente",
      size: "M",
      quantity: 10,
      hasNumbers: false,
      hasNames: false,
      createdAt: "2024-01-14",
      status: "completed"
    },
    {
      id: "3",
      name: "Design Personalizado",
      artUrl: "/placeholder.svg",
      templateType: "verso",
      size: "GG",
      quantity: 15,
      hasNumbers: true,
      hasNames: false,
      createdAt: "2024-01-13",
      status: "draft"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || project.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "draft": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "exported": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: Project["status"]) => {
    switch (status) {
      case "draft": return "Rascunho";
      case "completed": return "Finalizado";
      case "exported": return "Exportado";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-poppins">SublimaPro</h1>
                  <p className="text-sm text-gray-600">Gestão de Projetos de Sublimação</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/templates">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Moldes
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </Link>
              <Link to="/create">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                  <p className="text-3xl font-bold text-gray-900 font-poppins">{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Finalizados</p>
                  <p className="text-3xl font-bold text-gray-900 font-poppins">
                    {projects.filter(p => p.status === "completed" || p.status === "exported").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Peças Totais</p>
                  <p className="text-3xl font-bold text-gray-900 font-poppins">
                    {projects.reduce((total, project) => total + project.quantity, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-tertiary/20 rounded-lg flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-tertiary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Exportados</p>
                  <p className="text-3xl font-bold text-gray-900 font-poppins">
                    {projects.filter(p => p.status === "exported").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-xl font-poppins">Meus Projetos</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Todos ({projects.length})</TabsTrigger>
                <TabsTrigger value="draft">Rascunhos ({projects.filter(p => p.status === "draft").length})</TabsTrigger>
                <TabsTrigger value="completed">Finalizados ({projects.filter(p => p.status === "completed").length})</TabsTrigger>
                <TabsTrigger value="exported">Exportados ({projects.filter(p => p.status === "exported").length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto encontrado</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? "Tente ajustar os filtros de busca" : "Comece criando seu primeiro projeto de sublimação"}
                    </p>
                    <Link to="/create">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Projeto
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className="border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-0">
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative rounded-t-lg overflow-hidden">
                            <img 
                              src={project.artUrl} 
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge className={getStatusColor(project.status)}>
                                {getStatusLabel(project.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 font-poppins">{project.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                              <div className="flex items-center justify-between">
                                <span>Tipo: {project.templateType}</span>
                                <span>Tamanho: {project.size}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Quantidade: {project.quantity}</span>
                                <div className="flex space-x-1">
                                  {project.hasNumbers && (
                                    <Badge variant="outline" className="text-xs">Números</Badge>
                                  )}
                                  {project.hasNames && (
                                    <Badge variant="outline" className="text-xs">Nomes</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link to={`/project/${project.id}`} className="flex-1">
                                <Button size="sm" variant="outline" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </Button>
                              </Link>
                              <Button size="sm" variant="outline">
                                <Copy className="w-4 h-4" />
                              </Button>
                              {project.status === "exported" && (
                                <Link to={`/project/${project.id}/export`}>
                                  <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
