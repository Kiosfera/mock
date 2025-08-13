import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  FileImage,
  Download,
  Palette,
} from "lucide-react";

export default function Settings() {
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
                  Configure as preferências do aplicativo
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-md">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                <SettingsIcon className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Configurações Gerais
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Esta página permitirá personalizar as configurações de
                  exportação, qualidade e preferências gerais do sistema.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Configurações planejadas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-primary" />
                    <span>Qualidade de exportação padrão</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-primary" />
                    <span>Pasta padrão de download</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <span>Nomenclatura automática</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SettingsIcon className="w-4 h-4 text-primary" />
                    <span>Preferências de interface</span>
                  </div>
                </div>
              </div>
              <p className="text-primary font-medium">
                Continue conversando para implementar esta funcionalidade!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
