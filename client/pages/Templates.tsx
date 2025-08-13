import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Shirt } from "lucide-react";

export default function Templates() {
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
                  Catálogo de Moldes
                </h1>
                <p className="text-sm text-gray-600">
                  Visualize e gerencie seus moldes de sublimação
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
                <Package className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Catálogo de Moldes
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Esta página mostrará todos os moldes disponíveis organizados
                  por categoria, com filtros avançados e visualização detalhada.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Funcionalidades planejadas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <span>Filtros por tipo (frente, verso, manga)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <span>Visualização em grade e lista</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <span>Preview detalhado de cada molde</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <span>Upload de novos moldes</span>
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
