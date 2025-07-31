"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const getTodayDate = () => {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mockStats = [
  {
    agent: "FR_702",
    service: "BdsmZone CA-FR",
    heure: "4:00 - 4:59",
    messages: 3,
    mms: 0,
    total: 3,
    reponses: 2,
  },
  {
    agent: "FR_702",
    service: "BdsmZone FR",
    heure: "5:00 - 5:59",
    messages: 2,
    mms: 0,
    total: 2,
    reponses: 1,
  },
  {
    agent: "FR_702",
    service: "chatZone CA-FR",
    heure: "10:00 - 10:59",
    messages: 4,
    mms: 0,
    total: 4,
    reponses: 2,
  },
];

export default function StatsModal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"live" | "filter">("live");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg relative px-6 py-4">
        {/* Onglets */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold shadow ${
              activeTab === "live"
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("live")}
          >
            STATISTIQUES EN DIRECT
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === "filter"
                ? "bg-pink-600 text-white shadow"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("filter")}
          >
            STATISTIQUES FILTRABLES
          </button>
        </div>

        {/* Titre */}
        <h2 className="text-lg font-semibold mb-4">
          Vos statistiques d'aujourd'hui, {getTodayDate()}
        </h2>

        {/* Tableau */}
        <div className="overflow-auto rounded-md border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-4 py-2">Agent</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Heure</th>
                <th className="px-4 py-2">Messages</th>
                <th className="px-4 py-2">MMS</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Réponses du client</th>
              </tr>
            </thead>
            <tbody>
              {mockStats.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2">{row.agent}</td>
                  <td className="px-4 py-2">{row.service}</td>
                  <td className="px-4 py-2">{row.heure}</td>
                  <td className="px-4 py-2">{row.messages}</td>
                  <td className="px-4 py-2">{row.mms}</td>
                  <td className="px-4 py-2">{row.total}</td>
                  <td className="px-4 py-2">{row.reponses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bouton Fermer */}
        <Button
          variant="destructive"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </div>
  );
}
