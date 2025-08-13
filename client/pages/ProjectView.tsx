import { useState, useRef, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Center } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Download,
  Share,
  Copy,
  Edit3,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  FileImage,
  Package,
  Eye,
  Grid3x3,
  Palette,
  Settings,
} from "lucide-react";

interface ProjectData {
  id: string;
  name: string;
  artUrl: string;
  templateType: "frente" | "verso" | "manga";
  size: string;
  quantity: number;
  hasNumbers: boolean;
  hasNames: boolean;
  numberStart: number;
  numberEnd: number;
  namesList: string[];
  createdAt: string;
  status: "draft" | "completed" | "exported";
}

// Componente 3D da camiseta
function TShirt3D({
  artTexture,
  showNumbers,
  showNames,
  selectedPiece,
}: {
  artTexture: string;
  showNumbers: boolean;
  showNames: boolean;
  selectedPiece: number;
}) {
  return (
    <group>
      {/* Corpo da camiseta */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 5, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Área da arte */}
      <mesh position={[0, 0.5, 0.06]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#F72585" opacity={0.8} transparent />
      </mesh>

      {/* Numeração */}
      {showNumbers && (
        <Center position={[0, -1.5, 0.06]}>
          <Text
            fontSize={0.3}
            color="#4361EE"
            anchorX="center"
            anchorY="middle"
          >
            {String(selectedPiece).padStart(2, "0")}
          </Text>
        </Center>
      )}

      {/* Nome */}
      {showNames && (
        <Center position={[0, -2.2, 0.06]}>
          <Text
            fontSize={0.2}
            color="#2B2D42"
            anchorX="center"
            anchorY="middle"
          >
            JOGADOR {selectedPiece}
          </Text>
        </Center>
      )}

      {/* Mangas */}
      <mesh position={[-2.5, 1, 0]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[2.5, 1, 0]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export default function ProjectView() {
  const { id } = useParams();

  const [project] = useState<ProjectData>({
    id: id || "1",
    name: "Time Futebol Academia",
    artUrl: "/placeholder.svg",
    templateType: "frente",
    size: "G",
    quantity: 25,
    hasNumbers: true,
    hasNames: true,
    numberStart: 1,
    numberEnd: 25,
    namesList: ["JOÃO", "PEDRO", "LUCAS", "MIGUEL", "CARLOS"],
    createdAt: "2024-01-15",
    status: "completed",
  });

  const [selectedPiece, setSelectedPiece] = useState(1);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [show3DNumbers, setShow3DNumbers] = useState(true);
  const [show3DNames, setShow3DNames] = useState(true);
  const [zoom, setZoom] = useState([100]);

  const pieces = Array.from({ length: project.quantity }, (_, i) => ({
    number: project.numberStart + i,
    name: project.namesList[i % project.namesList.length] || `JOGADOR ${i + 1}`,
  }));

  const getStatusColor = (status: ProjectData["status"]) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "exported":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: ProjectData["status"]) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "completed":
        return "Finalizado";
      case "exported":
        return "Exportado";
      default:
        return "Desconhecido";
    }
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
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                    {project.name}
                  </h1>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {project.templateType} • {project.size} • {project.quantity}{" "}
                  peças
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
              <Link to={`/project/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Link to={`/project/${id}/export`}>
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Área de Preview */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controles de Visualização */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-poppins">
                    Preview da Peça
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "2d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("2d")}
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      2D
                    </Button>
                    <Button
                      variant={viewMode === "3d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("3d")}
                      className={
                        viewMode === "3d"
                          ? "bg-primary hover:bg-primary/90"
                          : ""
                      }
                    >
                      <Package className="w-4 h-4 mr-2" />
                      3D
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  {viewMode === "3d" ? (
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <TShirt3D
                          artTexture={project.artUrl}
                          showNumbers={show3DNumbers}
                          showNames={show3DNames}
                          selectedPiece={selectedPiece}
                        />
                        <OrbitControls
                          enablePan={true}
                          enableZoom={true}
                          enableRotate={true}
                        />
                      </Suspense>
                    </Canvas>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative p-8">
                      <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-lg shadow-lg relative overflow-hidden">
                        {/* Arte */}
                        <div
                          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-lg flex items-center justify-center"
                          style={{
                            transform: `translateX(-50%) scale(${zoom[0] / 100})`,
                          }}
                        >
                          <img
                            src={project.artUrl}
                            alt="Arte"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Numeração */}
                        {project.hasNumbers && (
                          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                            <span className="text-2xl font-bold text-secondary">
                              {String(selectedPiece).padStart(2, "0")}
                            </span>
                          </div>
                        )}

                        {/* Nome */}
                        {project.hasNames && (
                          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                            <span className="text-sm font-medium text-gray-700">
                              {pieces[selectedPiece - 1]?.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Controles de Zoom (apenas para 2D) */}
                {viewMode === "2d" && (
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Button variant="outline" size="sm">
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 max-w-xs">
                      <Slider
                        value={zoom}
                        onValueChange={setZoom}
                        max={200}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {zoom[0]}%
                    </span>
                  </div>
                )}

                {/* Controles 3D */}
                {viewMode === "3d" && (
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShow3DNumbers(!show3DNumbers)}
                      className={
                        show3DNumbers ? "bg-secondary/10 border-secondary" : ""
                      }
                    >
                      Números
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShow3DNames(!show3DNames)}
                      className={
                        show3DNames ? "bg-secondary/10 border-secondary" : ""
                      }
                    >
                      Nomes
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navegação entre Peças */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-poppins">
                  Navegar entre Peças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedPiece(Math.max(1, selectedPiece - 1))
                    }
                    disabled={selectedPiece <= 1}
                  >
                    Anterior
                  </Button>
                  <Select
                    value={selectedPiece.toString()}
                    onValueChange={(value) => setSelectedPiece(parseInt(value))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pieces.map((piece, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          #{piece.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedPiece(
                        Math.min(project.quantity, selectedPiece + 1),
                      )
                    }
                    disabled={selectedPiece >= project.quantity}
                  >
                    Próxima
                  </Button>
                </div>

                {/* Grid de Peças */}
                <div className="grid grid-cols-10 gap-1 max-h-40 overflow-y-auto">
                  {pieces.map((piece, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedPiece === index + 1 ? "default" : "outline"
                      }
                      size="sm"
                      className={`aspect-square p-0 text-xs ${
                        selectedPiece === index + 1
                          ? "bg-primary hover:bg-primary/90"
                          : ""
                      }`}
                      onClick={() => setSelectedPiece(index + 1)}
                    >
                      {piece.number}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar de Informações */}
          <div className="space-y-6">
            {/* Informações do Projeto */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  Informações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Molde:</span>
                    <span className="font-medium capitalize">
                      {project.templateType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{project.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantidade:</span>
                    <span className="font-medium">
                      {project.quantity} peças
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numeração:</span>
                    <span className="font-medium">
                      {project.hasNumbers
                        ? `${project.numberStart} - ${project.numberEnd}`
                        : "Não"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomes:</span>
                    <span className="font-medium">
                      {project.hasNames
                        ? `${project.namesList.length} nomes`
                        : "Não"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Criado em:</span>
                    <span className="font-medium">
                      {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peça Atual */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  Peça Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">
                    #{pieces[selectedPiece - 1]?.number}
                  </div>
                  {project.hasNames && (
                    <div className="text-lg font-medium text-gray-700">
                      {pieces[selectedPiece - 1]?.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/project/${id}/export`} className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Produção
                  </Button>
                </Link>
                <Link to={`/project/${id}/export-3d`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Exportar 3D
                  </Button>
                </Link>
                <Link to={`/project/${id}/apply`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Aplicar Arte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
