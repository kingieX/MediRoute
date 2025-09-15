import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveAlertsTab from "./ActiveAlertsTab";
import AlertHistoryTab from "./AlertHistoryTab";
import ConfigurationTab from "./ConfigurationTab";
import React from "react";

const AlertTabs = ({
  selectedSeverity,
  setSelectedSeverity,
  filteredActiveAlerts,
  filteredHistory,
  handleAcknowledgeAlert,
  handleResolveAlert,
  thresholds,
  configForm,
  setConfigForm,
  handleSaveThreshold,
}) => {
  return (
    <Tabs defaultValue="active" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active Alerts</TabsTrigger>
        <TabsTrigger value="history">Alert History</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <ActiveAlertsTab
          selectedSeverity={selectedSeverity}
          setSelectedSeverity={setSelectedSeverity}
          filteredActiveAlerts={filteredActiveAlerts}
          handleAcknowledgeAlert={handleAcknowledgeAlert}
          handleResolveAlert={handleResolveAlert}
        />
      </TabsContent>
      <TabsContent value="history">
        <AlertHistoryTab filteredHistory={filteredHistory} />
      </TabsContent>
      <TabsContent value="config">
        <ConfigurationTab
          thresholds={thresholds}
          configForm={configForm}
          setConfigForm={setConfigForm}
          handleSaveThreshold={handleSaveThreshold}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AlertTabs;
