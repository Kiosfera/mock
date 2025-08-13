import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Upload, 
  FileImage, 
  Check,
  Plus,
  Minus,
  Eye,
  Shirt,
  X
} from "lucide-react";

interface TemplateOption {
  id: string;
  name: string;
  type: "frente" | "verso" | "manga";
  preview: string;
  sizes: string[];
}

const templates: TemplateOption[] = [
  {
    id: "t1",
    name: "Básica Frente",
    type: "frente",
    preview: "/placeholder.svg",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: "t2", 
    name: "Sport Frente",
    type: "frente",
    preview: "/placeholder.svg",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: "t3",
    name: "Básica Verso",
    type: "verso", 
    preview: "/placeholder.svg",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: "t4",
    name: "Sport Verso",
    type: "verso",
    preview: "/placeholder.svg", 
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: "t5",
    name: "Manga Esquerda",
    type: "manga",
    preview: "/placeholder.svg",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  },
  {
    id: "t6",
    name: "Manga Direita", 
    type: "manga",
    preview: "/placeholder.svg",
    sizes: ["P", "M", "G", "GG", "XG", "XXG"]
  }
];

export default function CreateProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: "",
    artFile: null as File | null,
    artPreview: "",
    selectedTemplate: null as TemplateOption | null,
    selectedSize: "",
    quantity: 1,
    hasNumbers: false,
    hasNames: false,
    numberStart: 1,
    numberEnd: 1,
    namesList: [] as string[],
    fontSize: "16",
    fontWeight: "normal" as "normal" | "bold"
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProjectData(prev => ({ ...prev, artFile: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setProjectData(prev => ({ ...prev, artPreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template: TemplateOption) => {
    setProjectData(prev => ({ 
      ...prev, 
      selectedTemplate: template,
      selectedSize: template.sizes[0] // Auto-select first size
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    setProjectData(prev => ({
      ...prev,
      quantity: Math.max(1, newQuantity),
      numberEnd: prev.hasNumbers ? prev.numberStart + Math.max(1, newQuantity) - 1 : prev.numberEnd
    }));
  };

  const handleNumberingToggle = (enabled: boolean) => {
    setProjectData(prev => ({
      ...prev,
      hasNumbers: enabled,
      numberEnd: enabled ? prev.numberStart + prev.quantity - 1 : prev.numberEnd
    }));
  };

  const addName = () => {
    setProjectData(prev => ({
      ...prev,
      namesList: [...prev.namesList, ""]
    }));
  };

  const removeName = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      namesList: prev.namesList.filter((_, i) => i !== index)
    }));
  };

  const updateName = (index: number, value: string) => {
    setProjectData(prev => ({
      ...prev,
      namesList: prev.namesList.map((name, i) => i === index ? value : name)
    }));
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2: return projectData.name && projectData.artFile;
      case 3: return projectData.selectedTemplate && projectData.selectedSize;
      case 4: return true;
      default: return true;
    }
  };

  const handleCreateProject = () => {
    // Here you would normally save the project and navigate
    console.log("Creating project:", projectData);
    navigate("/");
  };

  const filterTemplatesByType = (type: string) => {
    return templates.filter(template => type === "all" || template.type === type);
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
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">Novo Projeto</h1>
                <p className="text-sm text-gray-600">Crie um novo projeto de sublimação</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? "bg-primary text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-0.5 ${
                      step < currentStep ? "bg-primary" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Project Info */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-poppins">Informações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="projectName">Nome do Projeto</Label>
                <Input
                  id="projectName"
                  placeholder="Ex: Time Futebol Academia 2024"
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Upload da Arte (PDF)</Label>
                <div 
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {projectData.artPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={projectData.artPreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600">{projectData.artFile?.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Clique para enviar a arte</p>
                        <p className="text-sm text-gray-600">Arquivo PDF vetorizado recomendado</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep(2)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Próximo: Escolher Molde
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Template Selection */}
        {currentStep === 2 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-poppins">Seleção de Molde</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="frente">Frente</TabsTrigger>
                  <TabsTrigger value="verso">Verso</TabsTrigger>
                  <TabsTrigger value="manga">Manga</TabsTrigger>
                </TabsList>

                {["all", "frente", "verso", "manga"].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filterTemplatesByType(type).map((template) => (
                        <Card 
                          key={template.id}
                          className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                            projectData.selectedTemplate?.id === template.id 
                              ? "border-primary bg-primary/5" 
                              : "border-gray-200"
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative rounded-t-lg overflow-hidden">
                              <img 
                                src={template.preview} 
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                              {projectData.selectedTemplate?.id === template.id && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-gray-900">{template.name}</h3>
                              <Badge variant="outline" className="mt-1 capitalize">
                                {template.type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {projectData.selectedTemplate && (
                      <div className="border-t pt-6">
                        <Label>Tamanho da Camiseta</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {projectData.selectedTemplate.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={projectData.selectedSize === size ? "default" : "outline"}
                              size="sm"
                              onClick={() => setProjectData(prev => ({ ...prev, selectedSize: size }))}
                              className={projectData.selectedSize === size ? "bg-primary hover:bg-primary/90" : ""}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToStep(3)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Próximo: Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Configuration */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-poppins">Configuração do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Quantidade de Peças</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuantityChange(projectData.quantity - 1)}
                    disabled={projectData.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={projectData.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuantityChange(projectData.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasNumbers"
                    checked={projectData.hasNumbers}
                    onCheckedChange={handleNumberingToggle}
                  />
                  <Label htmlFor="hasNumbers">Adicionar numeração automática</Label>
                </div>

                {projectData.hasNumbers && (
                  <div className="ml-6 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numberStart">Número inicial</Label>
                        <Input
                          id="numberStart"
                          type="number"
                          min="1"
                          value={projectData.numberStart}
                          onChange={(e) => setProjectData(prev => ({ 
                            ...prev, 
                            numberStart: parseInt(e.target.value) || 1,
                            numberEnd: (parseInt(e.target.value) || 1) + prev.quantity - 1
                          }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="numberEnd">Número final</Label>
                        <Input
                          id="numberEnd"
                          type="number"
                          value={projectData.numberEnd}
                          onChange={(e) => setProjectData(prev => ({ ...prev, numberEnd: parseInt(e.target.value) || 1 }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasNames"
                    checked={projectData.hasNames}
                    onCheckedChange={(checked) => setProjectData(prev => ({ ...prev, hasNames: checked as boolean }))}
                  />
                  <Label htmlFor="hasNames">Adicionar nomes personalizados</Label>
                </div>

                {projectData.hasNames && (
                  <div className="ml-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Lista de Nomes</Label>
                      <Button variant="outline" size="sm" onClick={addName}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Nome
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {projectData.namesList.map((name, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Nome ${index + 1}`}
                            value={name}
                            onChange={(e) => updateName(index, e.target.value)}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeName(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Configurações de Texto</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                    <Select 
                      value={projectData.fontSize} 
                      onValueChange={(value) => setProjectData(prev => ({ ...prev, fontSize: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                        <SelectItem value="20">20px</SelectItem>
                        <SelectItem value="24">24px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Peso da Fonte</Label>
                    <RadioGroup 
                      value={projectData.fontWeight} 
                      onValueChange={(value: "normal" | "bold") => setProjectData(prev => ({ ...prev, fontWeight: value }))}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bold" id="bold" />
                        <Label htmlFor="bold">Negrito</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Próximo: Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Create */}
        {currentStep === 4 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-poppins">Preview e Finalização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-poppins">Resumo do Projeto</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{projectData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Molde:</span>
                      <span className="font-medium">{projectData.selectedTemplate?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamanho:</span>
                      <span className="font-medium">{projectData.selectedSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantidade:</span>
                      <span className="font-medium">{projectData.quantity} peças</span>
                    </div>
                    {projectData.hasNumbers && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numeração:</span>
                        <span className="font-medium">{projectData.numberStart} - {projectData.numberEnd}</span>
                      </div>
                    )}
                    {projectData.hasNames && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nomes:</span>
                        <span className="font-medium">{projectData.namesList.filter(n => n).length} nomes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold font-poppins">Preview</h3>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 flex items-center justify-center aspect-square">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm">
                        <Shirt className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600">Preview da simulação aparecerá aqui</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  className="bg-primary hover:bg-primary/90"
                >
                  Criar Projeto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
