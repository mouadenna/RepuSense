"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tree, TreeNode } from "react-organizational-chart"
import { styled } from "@stitches/react"

const StyledNode = styled("div", {
  padding: "16px",
  borderRadius: "8px",
  display: "inline-block",
  border: "1px solid #e2e8f0",
})

const ProblemNode = styled(StyledNode, {
  backgroundColor: "#fee2e2",
  border: "1px solid #fecaca",
})

const CauseNode = styled(StyledNode, {
  backgroundColor: "#fef3c7",
  border: "1px solid #fde68a",
})

const SubCauseNode = styled(StyledNode, {
  backgroundColor: "#e0f2fe",
  border: "1px solid #bae6fd",
})

export function RootCauseAnalysis() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <p>
          Root cause analysis identifies the underlying factors contributing to the slow customer service response time
          issue. This analysis helps develop targeted solutions that address the core problems rather than just
          symptoms.
        </p>
      </div>

      <div className="overflow-auto pb-4">
        <div className="min-w-[800px]">
          <Tree
            lineWidth="2px"
            lineColor="#cbd5e1"
            lineBorderRadius="10px"
            label={
              <ProblemNode>
                <div className="font-medium">Slow Customer Service Response Time</div>
              </ProblemNode>
            }
          >
            <TreeNode
              label={
                <CauseNode>
                  <div className="font-medium">Insufficient Staff</div>
                </CauseNode>
              }
            >
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Limited budget allocation</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">High employee turnover</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Inadequate workforce planning</div>
                  </SubCauseNode>
                }
              />
            </TreeNode>
            <TreeNode
              label={
                <CauseNode>
                  <div className="font-medium">Inefficient Processes</div>
                </CauseNode>
              }
            >
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Manual ticket routing</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Lack of prioritization system</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Complex approval workflows</div>
                  </SubCauseNode>
                }
              />
            </TreeNode>
            <TreeNode
              label={
                <CauseNode>
                  <div className="font-medium">Technology Limitations</div>
                </CauseNode>
              }
            >
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Outdated CRM system</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">No automation capabilities</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Poor integration between systems</div>
                  </SubCauseNode>
                }
              />
            </TreeNode>
            <TreeNode
              label={
                <CauseNode>
                  <div className="font-medium">Training Gaps</div>
                </CauseNode>
              }
            >
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Insufficient onboarding</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">Lack of ongoing training</div>
                  </SubCauseNode>
                }
              />
              <TreeNode
                label={
                  <SubCauseNode>
                    <div className="text-sm">No knowledge base system</div>
                  </SubCauseNode>
                }
              />
            </TreeNode>
          </Tree>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Primary Causes</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Understaffing during peak hours (10am-2pm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Manual ticket routing causing 40% of delays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Legacy CRM system with limited capabilities</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-2">Contributing Factors</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>High employee turnover (35% annually)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Lack of standardized response templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>No automated chatbot for common inquiries</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
