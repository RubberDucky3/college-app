import { ImageResponse } from "next/og";
import { getCollegeById } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/utils";

export const alt = "College profile page";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const college = getCollegeById(id);
  if (!college) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: "#1e3a5f",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Geist",
          }}
        >
          College Not Found
        </div>
      ),
      { ...size }
    );
  }

  const primary = college.primaryColor || "#2563eb";
  const tuition =
    college.type === "public" && (college.tuitionInState ?? 0) > 0
      ? college.tuitionInState
      : college.tuitionOutOfState;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          color: "white",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 8,
            width: "100%",
            background: primary,
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px 60px",
          }}
        >
          {/* College name */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 8,
              display: "flex",
            }}
          >
            {college.name}
          </div>

          {/* Location */}
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              marginBottom: 32,
              display: "flex",
            }}
          >
            {college.city}, {college.state}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 40 }}>
            <StatBox
              label="Acceptance Rate"
              value={formatPercent(college.acceptanceRate, 1)}
            />
            <StatBox
              label="Tuition"
              value={tuition != null && tuition > 0 ? formatCurrency(tuition) : "Varies"}
            />
            <StatBox
              label="Graduation Rate"
              value={formatPercent(college.graduationRate4yr, 1)}
            />
            <StatBox
              label="Enrollment"
              value={
                (college.undergraduateEnrollment ?? 0) > 0
                  ? `${((college.undergraduateEnrollment ?? 0) / 1000).toFixed(1)}k`
                  : `${((college.totalEnrollment ?? 0) / 1000).toFixed(1)}k`
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            padding: "0 60px",
            fontSize: 18,
            color: "#64748b",
            borderTop: "1px solid #1e293b",
            gap: 24,
          }}
        >
          <span>CollegeHub</span>
          <span>college-app-delta.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "white",
        }}
      >
        {value}
      </div>
    </div>
  );
}
