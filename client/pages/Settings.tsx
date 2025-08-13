import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  FileImage,
  Download,
  Palette,
  FolderOpen,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  HardDrive,
  Cloud,
  Bell,
  Lock,
  User,
  Database,
} from "lucide-react";

interface Settings {
  // Exportação
  defaultQuality: number;
  defaultFormat: string;
  downloadFolder: string;
  autoNaming: boolean;
  namingPattern: string;
  includeMetadata: boolean;

  // Interface
  theme: string;
  language: string;
  autoSave: boolean;
  gridSize: number;
  showPreview: boolean;

  // Aplicação
  autoPosition: boolean;
  defaultFontSize: number;
  defaultFontWeight: string;
  snapToGrid: boolean;
  showGuides: boolean;

  // Backup
  autoBackup: boolean;
  backupInterval: number;
  cloudSync: boolean;

  // Notificações
  exportNotifications: boolean;
  errorNotifications: boolean;
  updateNotifications: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    // Exportação
    defaultQuality: 300,
    defaultFormat: "jpeg",
    downloadFolder: "",
    autoNaming: true,
    namingPattern: "{projeto}_{numero}_{data}",
    includeMetadata: true,

    // Interface
    theme: "system",
    language: "pt-BR",
    autoSave: true,
    gridSize: 20,
    showPreview: true,

    // Aplicação
    autoPosition: true,
    defaultFontSize: 16,
    defaultFontWeight: "normal",
    snapToGrid: true,
    showGuides: true,

    // Backup
    autoBackup: true,
    backupInterval: 30,
    cloudSync: false,

    // Notificações
    exportNotifications: true,
    errorNotifications: true,
    updateNotifications: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Implementar salvamento das configurações
    console.log("Salvando configurações:", settings);
    setHasChanges(false);
  };

  const resetSettings = () => {
    // Implementar reset para configurações padrão
    setHasChanges(false);
  };

  const selectFolder = () => {
    // Implementar seleção de pasta
    console.log("Selecionar pasta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Configurações
                </h1>
                <p className="text-sm text-gray-600">
                  Personalize suas preferências do sistema
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-200 bg-amber-50"
                >
                  Alterações não salvas
                </Badge>
              )}
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar
              </Button>
              <Button
                onClick={saveSettings}
                className="bg-primary hover:bg-primary/90"
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="export" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="export">Exportação</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="application">Aplicação</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          {/* Exportação */}
          <TabsContent value="export">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileImage className="w-5 h-5 text-primary" />
                    <span>Qualidade e Formato</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="quality">Qualidade Padrão (DPI)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[settings.defaultQuality]}
                        onValueChange={(value) =>
                          updateSetting("defaultQuality", value[0])
                        }
                        max={600}
                        min={72}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>72 DPI</span>
                        <span className="font-medium">
                          {settings.defaultQuality} DPI
                        </span>
                        <span>600 DPI</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="format">Formato Padrão</Label>
                    <Select
                      value={settings.defaultFormat}
                      onValueChange={(value) =>
                        updateSetting("defaultFormat", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG (.jpg)</SelectItem>
                        <SelectItem value="png">PNG (.png)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                        <SelectItem value="svg">SVG (.svg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="metadata">Incluir Metadados</Label>
                      <p className="text-sm text-gray-600">
                        Adicionar informações do projeto no arquivo
                      </p>
                    </div>
                    <Switch
                      id="metadata"
                      checked={settings.includeMetadata}
                      onCheckedChange={(checked) =>
                        updateSetting("includeMetadata", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-primary" />
                    <span>Download e Nomenclatura</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="downloadFolder">Pasta de Download</Label>
                    <div className="flex mt-2 space-x-2">
                      <Input
                        id="downloadFolder"
                        value={settings.downloadFolder}
                        onChange={(e) =>
                          updateSetting("downloadFolder", e.target.value)
                        }
                        placeholder="/caminho/para/pasta"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={selectFolder}>
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoNaming">
                        Nomenclatura Automática
                      </Label>
                      <p className="text-sm text-gray-600">
                        Gerar nomes automaticamente
                      </p>
                    </div>
                    <Switch
                      id="autoNaming"
                      checked={settings.autoNaming}
                      onCheckedChange={(checked) =>
                        updateSetting("autoNaming", checked)
                      }
                    />
                  </div>

                  {settings.autoNaming && (
                    <div>
                      <Label htmlFor="namingPattern">
                        Padrão de Nomenclatura
                      </Label>
                      <Input
                        id="namingPattern"
                        value={settings.namingPattern}
                        onChange={(e) =>
                          updateSetting("namingPattern", e.target.value)
                        }
                        placeholder="{projeto}_{numero}_{data}"
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use: {"{projeto}"}, {"{numero}"}, {"{nome}"}, {"{data}"}
                        , {"{hora}"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interface */}
          <TabsContent value="interface">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    <span>Aparência</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => updateSetting("theme", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        updateSetting("language", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (BR)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gridSize">Tamanho da Grade</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[settings.gridSize]}
                        onValueChange={(value) =>
                          updateSetting("gridSize", value[0])
                        }
                        max={50}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>10px</span>
                        <span className="font-medium">
                          {settings.gridSize}px
                        </span>
                        <span>50px</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Comportamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSave">Salvamento Automático</Label>
                      <p className="text-sm text-gray-600">
                        Salvar automaticamente a cada mudança
                      </p>
                    </div>
                    <Switch
                      id="autoSave"
                      checked={settings.autoSave}
                      onCheckedChange={(checked) =>
                        updateSetting("autoSave", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showPreview">Preview Automático</Label>
                      <p className="text-sm text-gray-600">
                        Mostrar preview ao editar
                      </p>
                    </div>
                    <Switch
                      id="showPreview"
                      checked={settings.showPreview}
                      onCheckedChange={(checked) =>
                        updateSetting("showPreview", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aplicação */}
          <TabsContent value="application">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <span>Posicionamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoPosition">
                        Posicionamento Automático
                      </Label>
                      <p className="text-sm text-gray-600">
                        Posicionar arte automaticamente
                      </p>
                    </div>
                    <Switch
                      id="autoPosition"
                      checked={settings.autoPosition}
                      onCheckedChange={(checked) =>
                        updateSetting("autoPosition", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="snapToGrid">Ajustar à Grade</Label>
                      <p className="text-sm text-gray-600">
                        Alinhar elementos à grade
                      </p>
                    </div>
                    <Switch
                      id="snapToGrid"
                      checked={settings.snapToGrid}
                      onCheckedChange={(checked) =>
                        updateSetting("snapToGrid", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showGuides">Mostrar Guias</Label>
                      <p className="text-sm text-gray-600">
                        Exibir linhas guia de alinhamento
                      </p>
                    </div>
                    <Switch
                      id="showGuides"
                      checked={settings.showGuides}
                      onCheckedChange={(checked) =>
                        updateSetting("showGuides", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <SettingsIcon className="w-5 h-5 text-primary" />
                    <span>Texto Padrão</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="fontSize">Tamanho da Fonte Padrão</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[settings.defaultFontSize]}
                        onValueChange={(value) =>
                          updateSetting("defaultFontSize", value[0])
                        }
                        max={48}
                        min={8}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>8px</span>
                        <span className="font-medium">
                          {settings.defaultFontSize}px
                        </span>
                        <span>48px</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontWeight">Peso da Fonte Padrão</Label>
                    <Select
                      value={settings.defaultFontWeight}
                      onValueChange={(value) =>
                        updateSetting("defaultFontWeight", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Leve</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="bold">Negrito</SelectItem>
                        <SelectItem value="black">Preto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Backup */}
          <TabsContent value="backup">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-primary" />
                    <span>Backup Local</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Backup Automático</Label>
                      <p className="text-sm text-gray-600">
                        Fazer backup automaticamente
                      </p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) =>
                        updateSetting("autoBackup", checked)
                      }
                    />
                  </div>

                  {settings.autoBackup && (
                    <div>
                      <Label htmlFor="backupInterval">
                        Intervalo de Backup (minutos)
                      </Label>
                      <div className="mt-2 space-y-2">
                        <Slider
                          value={[settings.backupInterval]}
                          onValueChange={(value) =>
                            updateSetting("backupInterval", value[0])
                          }
                          max={120}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>5min</span>
                          <span className="font-medium">
                            {settings.backupInterval}min
                          </span>
                          <span>120min</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="w-5 h-5 text-primary" />
                    <span>Sincronização</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cloudSync">Sincronização na Nuvem</Label>
                      <p className="text-sm text-gray-600">
                        Sincronizar com serviços em nuvem
                      </p>
                    </div>
                    <Switch
                      id="cloudSync"
                      checked={settings.cloudSync}
                      onCheckedChange={(checked) =>
                        updateSetting("cloudSync", checked)
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!settings.cloudSync}
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      Configurar Google Drive
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!settings.cloudSync}
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      Configurar Dropbox
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-md max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Preferências de Notificação</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="exportNotifications">
                      Notificações de Exportação
                    </Label>
                    <p className="text-sm text-gray-600">
                      Avisar quando exportação for concluída
                    </p>
                  </div>
                  <Switch
                    id="exportNotifications"
                    checked={settings.exportNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("exportNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="errorNotifications">
                      Notificações de Erro
                    </Label>
                    <p className="text-sm text-gray-600">
                      Avisar sobre erros no sistema
                    </p>
                  </div>
                  <Switch
                    id="errorNotifications"
                    checked={settings.errorNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("errorNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="updateNotifications">
                      Notificações de Atualização
                    </Label>
                    <p className="text-sm text-gray-600">
                      Avisar sobre novas versões
                    </p>
                  </div>
                  <Switch
                    id="updateNotifications"
                    checked={settings.updateNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("updateNotifications", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
