import { useState, useRef, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Center, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  Package, 
  Camera, 
  Palette, 
  RotateCcw,
  Play,
  Pause,
  Square,
  Image,
  FileImage,
  Grid3x3,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock
} from "lucide-react";

// Componente 3D da camiseta completa
function TShirt3DComplete({ 
  frontArt, 
  backArt, 
  sleeveArt, 
  showNumbers, 
  showNames, 
  pieceNumber,
  playerName,
  shirtColor,
  lighting,
  cameraAngle
}: {
  frontArt: string;
  backArt?: string;
  sleeveArt?: string;
  showNumbers: boolean;
  showNames: boolean;
  pieceNumber: number;
  playerName: string;
  shirtColor: string;
  lighting: string;
  cameraAngle: string;
}) {
  return (
    <group rotation={[0, cameraAngle === "front" ? 0 : cameraAngle === "back" ? Math.PI : Math.PI * 0.25, 0]}>
      {/* Corpo principal da camiseta */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 5, 0.15]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Arte frontal */}
      {cameraAngle !== "back" && (
        <mesh position={[0, 0.5, 0.08]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshStandardMaterial color="#F72585" opacity={0.9} transparent />
        </mesh>
      )}
      
      {/* Arte traseira */}
      {cameraAngle === "back" && backArt && (
        <mesh position={[0, 0.5, -0.08]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.5, 2.5]} />
          <meshStandardMaterial color="#4361EE" opacity={0.9} transparent />
        </mesh>
      )}
      
      {/* Numeração */}
      {showNumbers && (
        <Center position={[0, cameraAngle === "back" ? 0.5 : -1.5, cameraAngle === "back" ? -0.09 : 0.09]}>
          <Text
            fontSize={0.4}
            color={cameraAngle === "back" ? "#FFFFFF" : "#4361EE"}
            anchorX="center"
            anchorY="middle"
            rotation={cameraAngle === "back" ? [0, Math.PI, 0] : [0, 0, 0]}
          >
            {String(pieceNumber).padStart(2, '0')}
          </Text>
        </Center>
      )}
      
      {/* Nome do jogador */}
      {showNames && cameraAngle === "back" && (
        <Center position={[0, -0.5, -0.09]}>
          <Text
            fontSize={0.25}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI, 0]}
          >
            {playerName}
          </Text>
        </Center>
      )}
      
      {/* Mangas */}
      <mesh position={[-2.8, 1, 0]}>
        <boxGeometry args={[1.2, 2.5, 0.15]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[2.8, 1, 0]}>
        <boxGeometry args={[1.2, 2.5, 0.15]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      
      {/* Arte nas mangas */}
      {sleeveArt && (
        <>
          <mesh position={[-2.8, 1, 0.08]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial color="#4CC9F0" opacity={0.8} transparent />
          </mesh>
          <mesh position={[2.8, 1, 0.08]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial color="#4CC9F0" opacity={0.8} transparent />
          </mesh>
        </>
      )}
    </group>
  );
}

interface Export3DSettings {
  resolution: "720p" | "1080p" | "4k";
  format: "png" | "jpeg" | "webp";
  quality: number;
  backgroundColor: string;
  lighting: "studio" | "soft" | "dramatic" | "natural";
  cameraAngle: "front" | "back" | "side" | "angled";
  showNumbers: boolean;
  showNames: boolean;
  shirtColor: string;
  exportType: "single" | "all" | "animation";
  animationDuration: number;
}

interface ExportStatus {
  isExporting: boolean;
  currentRender: number;
  totalRenders: number;
  progress: number;
  status: "idle" | "rendering" | "completed" | "error";
  renderedImages: RenderedImage[];
}

interface RenderedImage {
  id: string;
  name: string;
  piece: number;
  angle: string;
  thumbnail: string;
  fullSize: string;
  size: string;
}

export default function ProjectExport3D() {
  const { id } = useParams();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [settings, setSettings] = useState<Export3DSettings>({
    resolution: "1080p",
    format: "png",
    quality: 95,
    backgroundColor: "#F5F5F5",
    lighting: "studio",
    cameraAngle: "front",
    showNumbers: true,
    showNames: true,
    shirtColor: "#FFFFFF",
    exportType: "single",
    animationDuration: 5
  });

  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    isExporting: false,
    currentRender: 0,
    totalRenders: 1,
    progress: 0,
    status: "idle",
    renderedImages: []
  });

  const [previewPiece, setPreviewPiece] = useState(1);
  const totalPieces = 25;

  const players = Array.from({ length: totalPieces }, (_, i) => ({
    number: i + 1,
    name: `JOGADOR ${i + 1}`
  }));

  const updateSetting = (key: keyof Export3DSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getResolutionInfo = (resolution: string) => {
    switch (resolution) {
      case "720p": return { width: 1280, height: 720, label: "HD (1280x720)" };
      case "1080p": return { width: 1920, height: 1080, label: "Full HD (1920x1080)" };
      case "4k": return { width: 3840, height: 2160, label: "4K (3840x2160)" };
      default: return { width: 1920, height: 1080, label: "Full HD" };
    }
  };

  const startExport = () => {
    const renderCount = settings.exportType === "all" ? totalPieces : 
                      settings.exportType === "animation" ? 60 : 1; // 60 frames para animação
    
    setExportStatus(prev => ({
      ...prev,
      isExporting: true,
      status: "rendering",
      currentRender: 0,
      totalRenders: renderCount,
      progress: 0,
      renderedImages: []
    }));

    // Simular renderização
    let currentRender = 1;
    const interval = setInterval(() => {
      if (currentRender <= renderCount) {
        setExportStatus(prev => ({
          ...prev,
          currentRender,
          progress: (currentRender / renderCount) * 100
        }));
        
        currentRender++;
      } else {
        // Simular imagens renderizadas
        const images: RenderedImage[] = [];
        if (settings.exportType === "single") {
          images.push({
            id: "render-1",
            name: `camiseta_3d_peca_${previewPiece}.${settings.format}`,
            piece: previewPiece,
            angle: settings.cameraAngle,
            thumbnail: "/placeholder.svg",
            fullSize: "/placeholder.svg",
            size: "2.5 MB"
          });
        } else if (settings.exportType === "all") {
          for (let i = 1; i <= totalPieces; i++) {
            images.push({
              id: `render-${i}`,
              name: `camiseta_3d_peca_${i}.${settings.format}`,
              piece: i,
              angle: settings.cameraAngle,
              thumbnail: "/placeholder.svg",
              fullSize: "/placeholder.svg",
              size: "2.5 MB"
            });
          }
        } else {
          images.push({
            id: "animation-1",
            name: `camiseta_3d_animacao.mp4`,
            piece: previewPiece,
            angle: "rotating",
            thumbnail: "/placeholder.svg",
            fullSize: "/placeholder.svg",
            size: "15.8 MB"
          });
        }
        
        setExportStatus(prev => ({
          ...prev,
          isExporting: false,
          status: "completed",
          currentRender: 0,
          renderedImages: images
        }));
        clearInterval(interval);
      }
    }, 200);
  };

  const cancelExport = () => {
    setExportStatus(prev => ({
      ...prev,
      isExporting: false,
      status: "idle"
    }));
  };

  const downloadImage = (image: RenderedImage) => {
    console.log("Download image:", image.name);
  };

  const downloadAll = () => {
    console.log("Download all 3D renders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to={`/project/${id}/export`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">Exportação 3D</h1>
                <p className="text-sm text-gray-600">Gere visualizações 3D realistas para apresentação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline">
                {settings.exportType === "single" ? `Peça ${previewPiece}` : 
                 settings.exportType === "all" ? `${totalPieces} peças` : "Animação"}
              </Badge>
              <Link to={`/project/${id}/export`}>
                <Button variant="outline">
                  <FileImage className="w-4 h-4 mr-2" />
                  Exportação 2D
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Preview 3D */}
          <div className="lg:col-span-3 space-y-6">
            {/* Viewport 3D */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-poppins">Preview 3D</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('cameraAngle', 'front')}
                      className={settings.cameraAngle === 'front' ? 'bg-primary/10 border-primary' : ''}
                    >
                      Frente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('cameraAngle', 'back')}
                      className={settings.cameraAngle === 'back' ? 'bg-primary/10 border-primary' : ''}
                    >
                      Verso
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('cameraAngle', 'angled')}
                      className={settings.cameraAngle === 'angled' ? 'bg-primary/10 border-primary' : ''}
                    >
                      Diagonal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ background: settings.backgroundColor }}>
                    <Suspense fallback={null}>
                      {/* Iluminação baseada na configuração */}
                      {settings.lighting === "studio" && (
                        <>
                          <ambientLight intensity={0.4} />
                          <directionalLight position={[10, 10, 5]} intensity={1} />
                          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                        </>
                      )}
                      {settings.lighting === "soft" && (
                        <>
                          <ambientLight intensity={0.6} />
                          <directionalLight position={[5, 5, 5]} intensity={0.8} />
                        </>
                      )}
                      {settings.lighting === "dramatic" && (
                        <>
                          <ambientLight intensity={0.2} />
                          <directionalLight position={[10, 10, 5]} intensity={1.5} />
                          <spotLight position={[-10, 10, 5]} intensity={0.8} />
                        </>
                      )}
                      {settings.lighting === "natural" && (
                        <>
                          <Environment preset="sunset" />
                          <ambientLight intensity={0.3} />
                        </>
                      )}
                      
                      <TShirt3DComplete 
                        frontArt="/placeholder.svg"
                        backArt="/placeholder.svg"
                        sleeveArt="/placeholder.svg"
                        showNumbers={settings.showNumbers}
                        showNames={settings.showNames}
                        pieceNumber={previewPiece}
                        playerName={players[previewPiece - 1]?.name || "JOGADOR"}
                        shirtColor={settings.shirtColor}
                        lighting={settings.lighting}
                        cameraAngle={settings.cameraAngle}
                      />
                      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                    </Suspense>
                  </Canvas>
                </div>

                {/* Controles de Navegação */}
                {settings.exportType !== "animation" && (
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPreviewPiece(Math.max(1, previewPiece - 1))}
                      disabled={previewPiece <= 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[5rem] text-center">
                      {previewPiece} / {totalPieces}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPreviewPiece(Math.min(totalPieces, previewPiece + 1))}
                      disabled={previewPiece >= totalPieces}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status de Renderização */}
            {exportStatus.status !== "idle" && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                    {exportStatus.status === "rendering" && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                    {exportStatus.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    <span>
                      {exportStatus.status === "rendering" && "Renderizando..."}
                      {exportStatus.status === "completed" && "Renderização Concluída"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {exportStatus.isExporting && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{Math.round(exportStatus.progress)}%</span>
                      </div>
                      <Progress value={exportStatus.progress} className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Render {exportStatus.currentRender} de {exportStatus.totalRenders}</span>
                        <span>Resolução: {getResolutionInfo(settings.resolution).label}</span>
                      </div>
                    </div>
                  )}

                  {exportStatus.status === "completed" && (
                    <div className="space-y-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{exportStatus.renderedImages.length}</div>
                        <div className="text-green-700 text-sm">Imagens Renderizadas</div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {exportStatus.renderedImages.map((image) => (
                          <Card key={image.id} className="border border-gray-200">
                            <CardContent className="p-3">
                              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 overflow-hidden">
                                <img 
                                  src={image.thumbnail} 
                                  alt={image.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-medium text-xs truncate">{image.name}</h3>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                  <span>Peça #{image.piece}</span>
                                  <span>{image.size}</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="w-full h-7 text-xs"
                                  onClick={() => downloadImage(image)}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Button 
                        onClick={downloadAll}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Todas as Imagens
                      </Button>
                    </div>
                  )}

                  {exportStatus.isExporting && (
                    <Button 
                      variant="outline" 
                      onClick={cancelExport}
                      className="w-full"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Cancelar Renderização
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Configurações */}
          <div className="space-y-6">
            {/* Controles de Renderização */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Renderização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo de Exportação</Label>
                  <Select 
                    value={settings.exportType} 
                    onValueChange={(value: "single" | "all" | "animation") => updateSetting('exportType', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Peça Atual</SelectItem>
                      <SelectItem value="all">Todas as Peças</SelectItem>
                      <SelectItem value="animation">Animação 360°</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Resolução</Label>
                  <Select 
                    value={settings.resolution} 
                    onValueChange={(value: "720p" | "1080p" | "4k") => updateSetting('resolution', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">HD (1280x720)</SelectItem>
                      <SelectItem value="1080p">Full HD (1920x1080)</SelectItem>
                      <SelectItem value="4k">4K (3840x2160)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Formato</Label>
                  <Select 
                    value={settings.format} 
                    onValueChange={(value: "png" | "jpeg" | "webp") => updateSetting('format', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG - Transparência</SelectItem>
                      <SelectItem value="jpeg">JPEG - Menor tamanho</SelectItem>
                      <SelectItem value="webp">WebP - Moderno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={startExport}
                  disabled={exportStatus.isExporting}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {exportStatus.isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Renderizando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Iniciar Renderização
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Configurações Visuais */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Aparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Iluminação</Label>
                  <Select 
                    value={settings.lighting} 
                    onValueChange={(value: "studio" | "soft" | "dramatic" | "natural") => updateSetting('lighting', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Estúdio</SelectItem>
                      <SelectItem value="soft">Suave</SelectItem>
                      <SelectItem value="dramatic">Dramática</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cor da Camiseta</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <div 
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      style={{ backgroundColor: settings.shirtColor }}
                      onClick={() => {/* Implementar color picker */}}
                    />
                    <Input
                      type="color"
                      value={settings.shirtColor}
                      onChange={(e) => updateSetting('shirtColor', e.target.value)}
                      className="w-16 h-8 p-0 border-0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Cor do Fundo</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <div 
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      style={{ backgroundColor: settings.backgroundColor }}
                      onClick={() => {/* Implementar color picker */}}
                    />
                    <Input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                      className="w-16 h-8 p-0 border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Mostrar Números</Label>
                    <Switch
                      checked={settings.showNumbers}
                      onCheckedChange={(checked) => updateSetting('showNumbers', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mostrar Nomes</Label>
                    <Switch
                      checked={settings.showNames}
                      onCheckedChange={(checked) => updateSetting('showNames', checked)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Qualidade ({settings.quality}%)</Label>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={(value) => updateSetting('quality', value[0])}
                    max={100}
                    min={70}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informações */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Resolução:</span>
                  <span>{getResolutionInfo(settings.resolution).label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato:</span>
                  <span>{settings.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Qualidade:</span>
                  <span>{settings.quality}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantidade:</span>
                  <span>
                    {settings.exportType === "single" ? "1 imagem" :
                     settings.exportType === "all" ? `${totalPieces} imagens` : "1 animação"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo estimado:</span>
                  <span>
                    {settings.exportType === "single" ? "~10s" :
                     settings.exportType === "all" ? `~${totalPieces * 10}s` : "~60s"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
