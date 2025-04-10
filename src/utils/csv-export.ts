import type { Password } from ".."

export function exportPasswordsToCSV(passwords: Password[]) {
  // Define CSV headers
  const headers = ["Name", "Password", "Strength", "Date Added"]

  // Convert passwords to CSV rows
  const rows = passwords.map((password) => [
    password.id,
    password.value,
    password.strengthScore,
    password.rarityScore,
    password.isUnique,
    new Date(password.createdAt).toLocaleDateString(),
  ])

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `password-vault-export-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  // Append to the document, click it, and remove it
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
