import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Maximize,
  Minimize,
  Grid3x3,
  Crosshair,
  CheckCircle,
  AlertCircle,
  Clock,
  Shirt,
} from "lucide-react";

interface ApplySettings {
  autoPosition: boolean;
  uniformSize: boolean;
  maintainAspectRatio: boolean;
  centerHorizontal: boolean;
  centerVertical: boolean;
  artScale: number;
  artRotation: number;
  artOffsetX: number;
  artOffsetY: number;
  numberPosition: "top" | "bottom" | "left" | "right";
  numberScale: number;
  namePosition: "top" | "bottom" | "left" | "right";
  nameScale: number;
  batchSize: number;
}

interface ProcessingStatus {
  isProcessing: boolean;
  currentPiece: number;
  totalPieces: number;
  progress: number;
  status: "idle" | "processing" | "completed" | "error";
  completedPieces: number[];
  errorPieces: number[];
}

export default function ProjectApply() {
  const { id } = useParams();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [settings, setSettings] = useState<ApplySettings>({
    autoPosition: true,
    uniformSize: true,
    maintainAspectRatio: true,
    centerHorizontal: true,
    centerVertical: true,
    artScale: 80,
    artRotation: 0,
    artOffsetX: 0,
    artOffsetY: 10,
    numberPosition: "bottom",
    numberScale: 100,
    namePosition: "bottom",
    nameScale: 80,
    batchSize: 5,
  });

  const [processing, setProcessing] = useState<ProcessingStatus>({
    isProcessing: false,
    currentPiece: 0,
    totalPieces: 25,
    progress: 0,
    status: "idle",
    completedPieces: [],
    errorPieces: [],
  });

  const [previewPiece, setPreviewPiece] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showGuides, setShowGuides] = useState(true);

  const updateSetting = (key: keyof ApplySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const startProcessing = () => {
    setProcessing((prev) => ({
      ...prev,
      isProcessing: true,
      status: "processing",
      currentPiece: 1,
      progress: 0,
      completedPieces: [],
      errorPieces: [],
    }));

    // Simular processamento
    let currentPiece = 1;
    const interval = setInterval(() => {
      if (currentPiece <= processing.totalPieces) {
        const success = Math.random() > 0.1; // 90% de sucesso

        setProcessing((prev) => ({
          ...prev,
          currentPiece,
          progress: (currentPiece / prev.totalPieces) * 100,
          completedPieces: success
            ? [...prev.completedPieces, currentPiece]
            : prev.completedPieces,
          errorPieces: !success
            ? [...prev.errorPieces, currentPiece]
            : prev.errorPieces,
        }));

        currentPiece++;
      } else {
        setProcessing((prev) => ({
          ...prev,
          isProcessing: false,
          status: "completed",
          currentPiece: 0,
        }));
        clearInterval(interval);
      }
    }, 500);
  };

  const pauseProcessing = () => {
    setProcessing((prev) => ({ ...prev, isProcessing: false }));
  };

  const stopProcessing = () => {
    setProcessing({
      isProcessing: false,
      currentPiece: 0,
      totalPieces: 25,
      progress: 0,
      status: "idle",
      completedPieces: [],
      errorPieces: [],
    });
  };

  const resetSettings = () => {
    setSettings({
      autoPosition: true,
      uniformSize: true,
      maintainAspectRatio: true,
      centerHorizontal: true,
      centerVertical: true,
      artScale: 80,
      artRotation: 0,
      artOffsetX: 0,
      artOffsetY: 10,
      numberPosition: "bottom",
      numberScale: 100,
      namePosition: "bottom",
      nameScale: 80,
      batchSize: 5,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link to={`/project/${id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                  Aplicação Automática
                </h1>
                <p className="text-sm text-gray-600">
                  Configure e aplique a arte em todas as peças
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-sm">
                Peça {previewPiece} de {processing.totalPieces}
              </Badge>
              {processing.status === "completed" && (
                <Link to={`/project/${id}/export`}>
                  <Button className="bg-primary hover:bg-primary/90">
                    Exportar Projeto
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Área de Preview */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controles de Preview */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-poppins">
                    Preview da Aplicação
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGrid(!showGrid)}
                      className={
                        showGrid ? "bg-secondary/10 border-secondary" : ""
                      }
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Grade
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGuides(!showGuides)}
                      className={
                        showGuides ? "bg-secondary/10 border-secondary" : ""
                      }
                    >
                      <Crosshair className="w-4 h-4 mr-2" />
                      Guias
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{
                      backgroundImage: showGrid
                        ? "radial-gradient(circle, #ddd 1px, transparent 1px)"
                        : "none",
                      backgroundSize: showGrid ? "20px 20px" : "auto",
                    }}
                  />

                  {/* Simulação de camiseta com arte */}
                  <div className="absolute inset-4 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center">
                    {/* Arte Central */}
                    <div
                      className="bg-primary/20 rounded-lg flex items-center justify-center relative"
                      style={{
                        width: `${settings.artScale}%`,
                        height: `${settings.artScale * 0.8}%`,
                        transform: `rotate(${settings.artRotation}deg) translate(${settings.artOffsetX}px, ${settings.artOffsetY}px)`,
                      }}
                    >
                      <div className="w-16 h-16 bg-primary/40 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">ARTE</span>
                      </div>

                      {showGuides && (
                        <>
                          {/* Guias de centralização */}
                          <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
                          <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                        </>
                      )}
                    </div>

                    {/* Numeração */}
                    <div
                      className={`absolute text-2xl font-bold text-secondary ${
                        settings.numberPosition === "bottom"
                          ? "bottom-8"
                          : settings.numberPosition === "top"
                            ? "top-8"
                            : settings.numberPosition === "left"
                              ? "left-8 top-1/2 transform -translate-y-1/2"
                              : "right-8 top-1/2 transform -translate-y-1/2"
                      }`}
                      style={{ fontSize: `${settings.numberScale}%` }}
                    >
                      {String(previewPiece).padStart(2, "0")}
                    </div>

                    {/* Nome */}
                    <div
                      className={`absolute text-lg font-medium text-gray-700 ${
                        settings.namePosition === "bottom"
                          ? "bottom-4"
                          : settings.namePosition === "top"
                            ? "top-4"
                            : settings.namePosition === "left"
                              ? "left-4 top-1/2 transform -translate-y-1/2"
                              : "right-4 top-1/2 transform -translate-y-1/2"
                      }`}
                      style={{ fontSize: `${settings.nameScale}%` }}
                    >
                      JOGADOR {previewPiece}
                    </div>
                  </div>
                </div>

                {/* Controles de Navegação */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreviewPiece(Math.max(1, previewPiece - 1))
                    }
                    disabled={previewPiece <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[5rem] text-center">
                    {previewPiece} / {processing.totalPieces}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPreviewPiece(
                        Math.min(processing.totalPieces, previewPiece + 1),
                      )
                    }
                    disabled={previewPiece >= processing.totalPieces}
                  >
                    Próxima
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status de Processamento */}
            {processing.status !== "idle" && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                    {processing.status === "processing" && (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                    {processing.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {processing.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>
                      {processing.status === "processing" && "Processando..."}
                      {processing.status === "completed" &&
                        "Processamento Concluído"}
                      {processing.status === "error" && "Erro no Processamento"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{Math.round(processing.progress)}%</span>
                    </div>
                    <Progress value={processing.progress} className="w-full" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {processing.completedPieces.length}
                      </div>
                      <div className="text-green-700">Concluídas</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {processing.isProcessing
                          ? processing.currentPiece
                          : processing.totalPieces}
                      </div>
                      <div className="text-blue-700">
                        {processing.isProcessing ? "Atual" : "Total"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {processing.errorPieces.length}
                      </div>
                      <div className="text-red-700">Erros</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    {processing.status === "processing" && (
                      <>
                        <Button variant="outline" onClick={pauseProcessing}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </Button>
                        <Button variant="outline" onClick={stopProcessing}>
                          <Square className="w-4 h-4 mr-2" />
                          Parar
                        </Button>
                      </>
                    )}
                    {processing.status === "completed" && (
                      <Link to={`/project/${id}/export`}>
                        <Button className="bg-primary hover:bg-primary/90">
                          Prosseguir para Exportação
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar de Configurações */}
          <div className="space-y-6">
            {/* Controles de Aplicação */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  Controles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startProcessing}
                  disabled={processing.isProcessing}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Aplicação
                </Button>
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurar Padrões
                </Button>
              </CardContent>
            </Card>

            {/* Configurações da Arte */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Arte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Escala ({settings.artScale}%)</Label>
                  <Slider
                    value={[settings.artScale]}
                    onValueChange={(value) =>
                      updateSetting("artScale", value[0])
                    }
                    max={150}
                    min={20}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Rotação ({settings.artRotation}°)</Label>
                  <Slider
                    value={[settings.artRotation]}
                    onValueChange={(value) =>
                      updateSetting("artRotation", value[0])
                    }
                    max={45}
                    min={-45}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Offset Vertical ({settings.artOffsetY}px)</Label>
                  <Slider
                    value={[settings.artOffsetY]}
                    onValueChange={(value) =>
                      updateSetting("artOffsetY", value[0])
                    }
                    max={50}
                    min={-50}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Centralizar Horizontalmente</Label>
                    <Switch
                      checked={settings.centerHorizontal}
                      onCheckedChange={(checked) =>
                        updateSetting("centerHorizontal", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Manter Proporção</Label>
                    <Switch
                      checked={settings.maintainAspectRatio}
                      onCheckedChange={(checked) =>
                        updateSetting("maintainAspectRatio", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Texto */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Texto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Posição do Número</Label>
                  <Select
                    value={settings.numberPosition}
                    onValueChange={(
                      value: "top" | "bottom" | "left" | "right",
                    ) => updateSetting("numberPosition", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Superior</SelectItem>
                      <SelectItem value="bottom">Inferior</SelectItem>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tamanho do Número ({settings.numberScale}%)</Label>
                  <Slider
                    value={[settings.numberScale]}
                    onValueChange={(value) =>
                      updateSetting("numberScale", value[0])
                    }
                    max={200}
                    min={50}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Posição do Nome</Label>
                  <Select
                    value={settings.namePosition}
                    onValueChange={(
                      value: "top" | "bottom" | "left" | "right",
                    ) => updateSetting("namePosition", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Superior</SelectItem>
                      <SelectItem value="bottom">Inferior</SelectItem>
                      <SelectItem value="left">Esquerda</SelectItem>
                      <SelectItem value="right">Direita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tamanho do Nome ({settings.nameScale}%)</Label>
                  <Slider
                    value={[settings.nameScale]}
                    onValueChange={(value) =>
                      updateSetting("nameScale", value[0])
                    }
                    max={150}
                    min={50}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Processamento */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  Processamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tamanho do Lote</Label>
                  <Select
                    value={settings.batchSize.toString()}
                    onValueChange={(value) =>
                      updateSetting("batchSize", parseInt(value))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 peça por vez</SelectItem>
                      <SelectItem value="5">5 peças por vez</SelectItem>
                      <SelectItem value="10">10 peças por vez</SelectItem>
                      <SelectItem value="25">Todas as peças</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Posicionamento Automático</Label>
                    <p className="text-xs text-gray-600">
                      Usar configurações padrão
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPosition}
                    onCheckedChange={(checked) =>
                      updateSetting("autoPosition", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
