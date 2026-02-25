function status(request, response) {
  response.status(200).json({ message: "Boa deu bom" });
}
export default status;
