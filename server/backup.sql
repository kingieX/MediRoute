--
-- PostgreSQL database dump
--

\restrict q5zggjgN0j3Xdry7TYtx8eDygpcUT5l0qBh5AkHWzfcTEtwuV2nOGkCvvSZZ0VK

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PatientStatus; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public."PatientStatus" AS ENUM (
    'WAITING',
    'IN_TREATMENT',
    'DISCHARGED'
);


ALTER TYPE public."PatientStatus" OWNER TO avnadmin;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: avnadmin
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'NURSE'
);


ALTER TYPE public."Role" OWNER TO avnadmin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alert; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Alert" (
    id text NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    resolved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Alert" OWNER TO avnadmin;

--
-- Name: Department; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Department" (
    id text NOT NULL,
    name text NOT NULL,
    capacity integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Department" OWNER TO avnadmin;

--
-- Name: EventLog; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."EventLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EventLog" OWNER TO avnadmin;

--
-- Name: Patient; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Patient" (
    id text NOT NULL,
    name text NOT NULL,
    status public."PatientStatus" DEFAULT 'WAITING'::public."PatientStatus" NOT NULL,
    "departmentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Patient" OWNER TO avnadmin;

--
-- Name: Shift; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."Shift" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "departmentId" text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Shift" OWNER TO avnadmin;

--
-- Name: User; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'NURSE'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO avnadmin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO avnadmin;

--
-- Data for Name: Alert; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."Alert" (id, type, message, resolved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."Department" (id, name, capacity, "createdAt", "updatedAt") FROM stdin;
cmeyr19td0000x554rt47vd5q	Emergency	50	2025-08-30 21:03:41.807	2025-08-30 21:03:41.807
cmeyrf26a0000x5ukco95o7mv	Cardiology	30	2025-08-30 21:14:25.087	2025-08-30 21:14:25.087
\.


--
-- Data for Name: EventLog; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."EventLog" (id, "userId", action, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."Patient" (id, name, status, "departmentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Shift; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."Shift" (id, "userId", "departmentId", "startTime", "endTime", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public."User" (id, email, password, role, "createdAt", "updatedAt") FROM stdin;
cmeyjewcd0000x5k41h0sjc4b	admin@mediroute.com	$2b$10$VXJ2G3vXvcRWq0ZBpRxNBedL2cnrMY9fBuVCiOPwPohX5QLOCq.G2	ADMIN	2025-08-30 17:30:20.605	2025-08-30 17:30:20.605
cmeyp2y400000x57o3ez8wzf3	nurse@hospital.com	$2b$10$nAyNZ/ncBteVKSey2s3WVOrlzivo5V58PtVvJ39sVJx5k8z9hX1Jm	NURSE	2025-08-30 20:09:00.701	2025-08-30 20:20:07.881
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0f384b5c-eb6a-431f-a933-80e1421218d9	543a2e2d53e186f36ba05b22239d048ae9c7dada3073285b1ca3bfb97a2c5eb7	2025-08-30 17:13:52.623629+00	20250830171350_init	\N	\N	2025-08-30 17:13:51.386389+00	1
008a0202-9987-40a1-860d-8358564b0d05	f033442e74822f53033dd00c1c9126589b3282a8ac969d89933470550481eea0	2025-08-30 19:47:25.63067+00	20250830194723_add_core_models	\N	\N	2025-08-30 19:47:24.693695+00	1
\.


--
-- Name: Alert Alert_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_pkey" PRIMARY KEY (id);


--
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- Name: EventLog EventLog_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."EventLog"
    ADD CONSTRAINT "EventLog_pkey" PRIMARY KEY (id);


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY (id);


--
-- Name: Shift Shift_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Department_name_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX "Department_name_key" ON public."Department" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: EventLog EventLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."EventLog"
    ADD CONSTRAINT "EventLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Patient Patient_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Shift Shift_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Shift Shift_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict q5zggjgN0j3Xdry7TYtx8eDygpcUT5l0qBh5AkHWzfcTEtwuV2nOGkCvvSZZ0VK

