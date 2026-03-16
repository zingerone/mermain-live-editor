package delivery

import (
	"encoding/json"
	"html/template"
	"mermaid-app/internal/domain"
	"net/http"
	"strconv"
)

type HttpHandler struct {
	Usecase domain.DiagramUsecase
}

func NewHttpHandler(uc domain.DiagramUsecase) {
	handler := &HttpHandler{Usecase: uc}
	http.HandleFunc("/", handler.ServeUI)
	http.HandleFunc("/api/list", handler.List)
	http.HandleFunc("/api/save", handler.Save)
	http.HandleFunc("/api/delete", handler.Delete)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
}

func (h *HttpHandler) ServeUI(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, nil)
}

func (h *HttpHandler) List(w http.ResponseWriter, r *http.Request) {
	data, _ := h.Usecase.GetAll(r.Context())
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *HttpHandler) Save(w http.ResponseWriter, r *http.Request) {
	var d domain.Diagram
	json.NewDecoder(r.Body).Decode(&d)
	h.Usecase.Save(r.Context(), &d)
	w.Write([]byte("OK"))
}

func (h *HttpHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	h.Usecase.Delete(r.Context(), id)
	w.Write([]byte("OK"))
}
