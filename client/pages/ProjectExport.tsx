import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  FileImage,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  FolderOpen,
  Archive,
  Image,
  FileText,
  Grid3x3,
  Eye,
  Copy,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface ExportSettings {
  format: "jpeg" | "png" | "pdf" | "svg";
  quality: number;
  resolution: number;
  includeNumbers: boolean;
  includeNames: boolean;
  backgroundColor: string;
  outputSize: "original" | "a4" | "custom";
  customWidth: number;
  customHeight: number;
  padding: number;
  compression: number;
  colorProfile: "sRGB" | "CMYK" | "RGB";
  naming: "auto" | "custom";
  namingPattern: string;
  separateFiles: boolean;
  createZip: boolean;
}

interface ExportStatus {
  isExporting: boolean;
  currentFile: number;
  totalFiles: number;
  progress: number;
  status: "idle" | "preparing" | "exporting" | "completed" | "error";
  exportedFiles: ExportedFile[];
  errors: string[];
  estimatedTime: number;
  elapsedTime: number;
}

interface ExportedFile {
  id: string;
  name: string;
  size: string;
  format: string;
  path: string;
  thumbnail: string;
  piece: number;
  exported: boolean;
}

export default function ProjectExport() {
  const { id } = useParams();

  const [settings, setSettings] = useState<ExportSettings>({
    format: "jpeg",
    quality: 95,
    resolution: 300,
    includeNumbers: true,
    includeNames: true,
    backgroundColor: "#FFFFFF",
    outputSize: "original",
    customWidth: 1920,
    customHeight: 1080,
    padding: 50,
    compression: 85,
    colorProfile: "sRGB",
    naming: "auto",
    namingPattern: "{projeto}_{numero}_{nome}",
    separateFiles: true,
    createZip: true,
  });

  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    isExporting: false,
    currentFile: 0,
    totalFiles: 25,
    progress: 0,
    status: "idle",
    exportedFiles: [],
    errors: [],
    estimatedTime: 0,
    elapsedTime: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<ExportedFile | null>(null);

  // Simular arquivos exportados
  useEffect(() => {
    if (exportStatus.status === "completed") {
      const files: ExportedFile[] = Array.from({ length: 25 }, (_, i) => ({
        id: `file-${i + 1}`,
        name: `time_futebol_${String(i + 1).padStart(2, "0")}_jogador${i + 1}.${settings.format}`,
        size: `${(Math.random() * 5 + 2).toFixed(1)} MB`,
        format: settings.format.toUpperCase(),
        path: `/exports/time_futebol_${String(i + 1).padStart(2, "0")}_jogador${i + 1}.${settings.format}`,
        thumbnail: "/placeholder.svg",
        piece: i + 1,
        exported: true,
      }));

      setExportStatus((prev) => ({ ...prev, exportedFiles: files }));
    }
  }, [exportStatus.status, settings.format]);

  const updateSetting = (key: keyof ExportSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const startExport = () => {
    setExportStatus((prev) => ({
      ...prev,
      isExporting: true,
      status: "preparing",
      currentFile: 0,
      progress: 0,
      exportedFiles: [],
      errors: [],
      elapsedTime: 0,
    }));

    // Simular preparação
    setTimeout(() => {
      setExportStatus((prev) => ({ ...prev, status: "exporting" }));

      // Simular exportação
      let currentFile = 1;
      const startTime = Date.now();

      const interval = setInterval(() => {
        if (currentFile <= exportStatus.totalFiles) {
          const success = Math.random() > 0.05; // 95% de sucesso

          setExportStatus((prev) => ({
            ...prev,
            currentFile,
            progress: (currentFile / prev.totalFiles) * 100,
            elapsedTime: Math.floor((Date.now() - startTime) / 1000),
            estimatedTime: Math.floor(
              (((Date.now() - startTime) / currentFile) * prev.totalFiles -
                (Date.now() - startTime)) /
                1000,
            ),
            errors: !success
              ? [...prev.errors, `Erro ao exportar peça ${currentFile}`]
              : prev.errors,
          }));

          currentFile++;
        } else {
          setExportStatus((prev) => ({
            ...prev,
            isExporting: false,
            status: "completed",
            currentFile: 0,
          }));
          clearInterval(interval);
        }
      }, 300);
    }, 1000);
  };

  const cancelExport = () => {
    setExportStatus((prev) => ({
      ...prev,
      isExporting: false,
      status: "idle",
    }));
  };

  const downloadFile = (file: ExportedFile) => {
    // Implementar download individual
    console.log("Download file:", file.name);
  };

  const downloadSelected = () => {
    if (selectedFiles.length === 0) return;
    console.log("Download selected files:", selectedFiles);
  };

  const downloadAll = () => {
    console.log("Download all files");
  };

  const selectAllFiles = () => {
    setSelectedFiles(exportStatus.exportedFiles.map((f) => f.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const getFileSizeTotal = () => {
    return exportStatus.exportedFiles
      .filter((f) => selectedFiles.includes(f.id))
      .reduce((total, file) => total + parseFloat(file.size), 0)
      .toFixed(1);
  };

  const getFormatInfo = (format: string) => {
    switch (format) {
      case "jpeg":
        return {
          label: "JPEG",
          description: "Menor tamanho, boa qualidade",
          icon: Image,
        };
      case "png":
        return {
          label: "PNG",
          description: "Transparência, maior qualidade",
          icon: Image,
        };
      case "pdf":
        return {
          label: "PDF",
          description: "Vetorial, ideal para impressão",
          icon: FileText,
        };
      case "svg":
        return {
          label: "SVG",
          description: "Vetorial, escalável",
          icon: FileText,
        };
      default:
        return {
          label: format.toUpperCase(),
          description: "",
          icon: FileImage,
        };
    }
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
                  Exportação para Produção
                </h1>
                <p className="text-sm text-gray-600">
                  {exportStatus.status === "completed"
                    ? `${exportStatus.exportedFiles.length} arquivos exportados`
                    : "Configure e exporte arquivos para impressão"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {exportStatus.status === "completed" &&
                selectedFiles.length > 0 && (
                  <Badge variant="outline">
                    {selectedFiles.length} selecionado
                    {selectedFiles.length !== 1 ? "s" : ""} (
                    {getFileSizeTotal()} MB)
                  </Badge>
                )}
              <Link to={`/project/${id}/export-3d`}>
                <Button variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Exportar 3D
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configurações */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-poppins">
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Formato</Label>
                  <Select
                    value={settings.format}
                    onValueChange={(value: "jpeg" | "png" | "pdf" | "svg") =>
                      updateSetting("format", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG - Menor tamanho</SelectItem>
                      <SelectItem value="png">PNG - Alta qualidade</SelectItem>
                      <SelectItem value="pdf">PDF - Impressão</SelectItem>
                      <SelectItem value="svg">SVG - Vetorial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Qualidade ({settings.quality}%)</Label>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={settings.quality}
                    onChange={(e) =>
                      updateSetting("quality", parseInt(e.target.value))
                    }
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label>Resolução (DPI)</Label>
                  <Select
                    value={settings.resolution.toString()}
                    onValueChange={(value) =>
                      updateSetting("resolution", parseInt(value))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="72">72 DPI - Web</SelectItem>
                      <SelectItem value="150">150 DPI - Boa</SelectItem>
                      <SelectItem value="300">300 DPI - Alta</SelectItem>
                      <SelectItem value="600">600 DPI - Máxima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Incluir Números</Label>
                    <Switch
                      checked={settings.includeNumbers}
                      onCheckedChange={(checked) =>
                        updateSetting("includeNumbers", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Incluir Nomes</Label>
                    <Switch
                      checked={settings.includeNames}
                      onCheckedChange={(checked) =>
                        updateSetting("includeNames", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Criar ZIP</Label>
                    <Switch
                      checked={settings.createZip}
                      onCheckedChange={(checked) =>
                        updateSetting("createZip", checked)
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={startExport}
                  disabled={exportStatus.isExporting}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {exportStatus.isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Iniciar Exportação
                    </>
                  )}
                </Button>

                {exportStatus.isExporting && (
                  <Button
                    variant="outline"
                    onClick={cancelExport}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Informações da Exportação */}
            {exportStatus.status !== "idle" && (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                    {exportStatus.status === "preparing" && (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                    {exportStatus.status === "exporting" && (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {exportStatus.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {exportStatus.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="capitalize">
                      {exportStatus.status === "preparing"
                        ? "Preparando"
                        : exportStatus.status === "exporting"
                          ? "Exportando"
                          : exportStatus.status === "completed"
                            ? "Concluído"
                            : "Erro"}
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
                      <Progress
                        value={exportStatus.progress}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Arquivo {exportStatus.currentFile} de{" "}
                          {exportStatus.totalFiles}
                        </span>
                        <span>
                          {exportStatus.elapsedTime}s / ~
                          {exportStatus.estimatedTime}s
                        </span>
                      </div>
                    </div>
                  )}

                  {exportStatus.status === "completed" && (
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {exportStatus.exportedFiles.length}
                        </div>
                        <div className="text-green-700 text-sm">
                          Arquivos Exportados
                        </div>
                      </div>

                      {exportStatus.errors.length > 0 && (
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {exportStatus.errors.length}
                          </div>
                          <div className="text-red-700 text-sm">Erros</div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Área Principal */}
          <div className="lg:col-span-3 space-y-6">
            {exportStatus.status === "completed" && (
              <>
                {/* Controles de Download */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-poppins">
                        Arquivos Exportados
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={
                            selectedFiles.length ===
                            exportStatus.exportedFiles.length
                              ? clearSelection
                              : selectAllFiles
                          }
                        >
                          {selectedFiles.length ===
                          exportStatus.exportedFiles.length
                            ? "Desmarcar Todos"
                            : "Selecionar Todos"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadSelected}
                          disabled={selectedFiles.length === 0}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Selecionados
                        </Button>
                        <Button
                          size="sm"
                          onClick={downloadAll}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Download Tudo (ZIP)
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Lista de Arquivos */}
                <Tabs defaultValue="grid" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Grade
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <FileText className="w-4 h-4 mr-2" />
                      Lista
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {exportStatus.exportedFiles.map((file) => (
                        <Card
                          key={file.id}
                          className={`border-2 cursor-pointer transition-all hover:shadow-md ${
                            selectedFiles.includes(file.id)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedFiles((prev) =>
                              prev.includes(file.id)
                                ? prev.filter((id) => id !== file.id)
                                : [...prev, file.id],
                            );
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 relative overflow-hidden">
                              <img
                                src={file.thumbnail}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2">
                                <Checkbox
                                  checked={selectedFiles.includes(file.id)}
                                  onChange={() => {}}
                                  className="bg-white/80"
                                />
                              </div>
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="text-xs">
                                  {file.format}
                                </Badge>
                              </div>
                              <div className="absolute bottom-2 right-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-8 h-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewFile(file);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium text-sm truncate">
                                {file.name}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Peça #{file.piece}</span>
                                <span>{file.size}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="list">
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-0">
                        <div className="space-y-1">
                          {exportStatus.exportedFiles.map((file, index) => (
                            <div
                              key={file.id}
                              className={`p-4 hover:bg-gray-50 transition-colors flex items-center space-x-4 ${
                                index !== exportStatus.exportedFiles.length - 1
                                  ? "border-b border-gray-100"
                                  : ""
                              }`}
                            >
                              <Checkbox
                                checked={selectedFiles.includes(file.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedFiles((prev) =>
                                    checked
                                      ? [...prev, file.id]
                                      : prev.filter((id) => id !== file.id),
                                  );
                                }}
                              />
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={file.thumbnail}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {file.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Peça #{file.piece}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {file.format}
                                  </Badge>
                                  <span>{file.size}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadFile(file)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* Estado Inicial */}
            {exportStatus.status === "idle" && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-12">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                      <FileImage className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                        Pronto para Exportar
                      </h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Configure as opções de exportação ao lado e clique em
                        "Iniciar Exportação" para gerar os arquivos de produção.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Formatos disponíveis:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {["jpeg", "png", "pdf", "svg"].map((format) => {
                          const info = getFormatInfo(format);
                          const Icon = info.icon;
                          return (
                            <div
                              key={format}
                              className="text-center p-3 bg-gray-50 rounded-lg"
                            >
                              <Icon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                              <div className="font-medium text-gray-900">
                                {info.label}
                              </div>
                              <div className="text-xs text-gray-600">
                                {info.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
