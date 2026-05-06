--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: add_category_created_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_category_created_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('category_created', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_category_deleted_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_category_deleted_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('category_deleted', row_to_json(OLD));
      RETURN OLD;
    END;
    $$;


--
-- Name: add_category_updated_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_category_updated_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('category_updated', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_customer_created_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_customer_created_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('customer_created', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_customer_deleted_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_customer_deleted_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('customer_deleted', row_to_json(OLD));
      RETURN OLD;
    END;
    $$;


--
-- Name: add_customer_updated_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_customer_updated_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('customer_updated', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_order_created_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_order_created_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('order_created', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_product_created_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_product_created_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('product_created', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_product_deleted_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_product_deleted_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('product_deleted', row_to_json(OLD));
      RETURN OLD;
    END;
    $$;


--
-- Name: add_product_inventory_updated_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_product_inventory_updated_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('inventory_updated', json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
      RETURN NEW;
    END;
    $$;


--
-- Name: add_product_updated_event(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_product_updated_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      INSERT INTO event (name, data)
      VALUES ('product_updated', row_to_json(NEW));
      RETURN NEW;
    END;
    $$;


--
-- Name: build_url_key(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.build_url_key() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
      url_key TEXT;
    BEGIN
      IF(NEW.url_key IS NULL) THEN
        url_key = regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g');
        url_key = regexp_replace(url_key, '^-|-$', '', 'g');
        url_key = lower(url_key);
        url_key = url_key || '-' || (SELECT floor(random() * 1000000)::text);
        NEW.url_key = url_key;
      ELSE
        IF (NEW.url_key ~ '[/\#]') THEN
          RAISE EXCEPTION 'Invalid url_key: %', NEW.url_key;
        END IF;
      END IF;
      RETURN NEW;
    END;
    $_$;


--
-- Name: delete_product_attribute_value_index(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_product_attribute_value_index() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        DELETE FROM "product_attribute_value_index" WHERE "product_attribute_value_index".option_id = OLD.attribute_option_id AND "product_attribute_value_index"."attribute_id" = OLD.attribute_id;
        RETURN OLD;
      END;
      $$;


--
-- Name: delete_sub_categories(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_sub_categories() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE
      sub_categories RECORD;
    BEGIN
      FOR sub_categories IN
        WITH RECURSIVE sub_categories AS (
          SELECT * FROM category WHERE parent_id = OLD.category_id
          UNION
          SELECT c.* FROM category c
          INNER JOIN sub_categories sc ON c.parent_id = sc.category_id
        ) SELECT * FROM sub_categories
      LOOP
        DELETE FROM category WHERE category_id = sub_categories.category_id;
      END LOOP;
      RETURN OLD;
    END;
    $$;


--
-- Name: delete_variant_group_after_attribute_type_changed(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_variant_group_after_attribute_type_changed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF (OLD.type = 'select' AND NEW.type <> 'select') THEN
          DELETE FROM "variant_group" WHERE ("variant_group".attribute_one = OLD.attribute_id OR "variant_group".attribute_two = OLD.attribute_id OR "variant_group".attribute_three = OLD.attribute_id OR "variant_group".attribute_four = OLD.attribute_id OR "variant_group".attribute_five = OLD.attribute_id);
        END IF;
        RETURN NEW;
      END
      $$;


--
-- Name: prevent_change_attribute_group(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_change_attribute_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF OLD.group_id != NEW.group_id AND OLD.variant_group_id IS NOT NULL THEN
          RAISE EXCEPTION 'Cannot change attribute group of product with variants';
        END IF;
        RETURN NEW;
      END;
      $$;


--
-- Name: prevent_delete_default_attribute_group(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_delete_default_attribute_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF OLD.attribute_group_id = 1 THEN
          RAISE EXCEPTION 'Cannot delete default attribute group';
        END IF;
        RETURN OLD;
      END;
      $$;


--
-- Name: prevent_delete_default_customer_group(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_delete_default_customer_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF OLD.customer_group_id = 1 THEN
          RAISE EXCEPTION 'Cannot delete default customer group';
        END IF;
        RETURN OLD;
      END;
      $$;


--
-- Name: prevent_delete_default_tax_class(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_delete_default_tax_class() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF OLD.tax_class_id = 1 THEN
          RAISE EXCEPTION 'Cannot delete default tax class';
        END IF;
        RETURN OLD;
      END;
      $$;


--
-- Name: product_image_insert_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.product_image_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        INSERT INTO event (name, data)
        VALUES ('product_image_added', row_to_json(NEW));
        RETURN NEW;
      END;
      $$;


--
-- Name: reduce_product_stock_when_order_placed(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.reduce_product_stock_when_order_placed() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        UPDATE product_inventory SET qty = qty - NEW.qty WHERE product_inventory_product_id = NEW.product_id AND manage_stock = TRUE;
        RETURN NEW;
      END
      $$;


--
-- Name: remove_attribute_from_group(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_attribute_from_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        DELETE FROM product_attribute_value_index WHERE product_attribute_value_index.attribute_id = OLD.attribute_id AND product_attribute_value_index.product_id IN (SELECT product.product_id FROM product WHERE product.group_id = OLD.group_id);
        DELETE FROM variant_group WHERE variant_group.attribute_group_id = OLD.group_id AND (variant_group.attribute_one = OLD.attribute_id OR variant_group.attribute_two = OLD.attribute_id OR variant_group.attribute_three = OLD.attribute_id OR variant_group.attribute_four = OLD.attribute_id OR variant_group.attribute_five = OLD.attribute_id);
        RETURN OLD;
      END;
      $$;


--
-- Name: set_coupon_used_time(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_coupon_used_time() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        UPDATE "coupon" SET used_time = used_time + 1 WHERE coupon = NEW.coupon;
        RETURN NEW;
      END;
      $$;


--
-- Name: set_default_customer_group(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_default_customer_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.group_id IS NULL THEN
          NEW.group_id = 1;
        END IF;
        RETURN NEW;
      END;
      $$;


--
-- Name: update_attribute_index_and_variant_group_visibility(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_attribute_index_and_variant_group_visibility() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        DELETE FROM "product_attribute_value_index"
        WHERE "product_attribute_value_index"."product_id" = NEW.product_id 
        AND "product_attribute_value_index"."attribute_id" NOT IN (SELECT "attribute_group_link"."attribute_id" FROM "attribute_group_link" WHERE "attribute_group_link"."group_id" = NEW.group_id);
        UPDATE "variant_group" SET visibility = COALESCE((SELECT bool_or(visibility) FROM "product" WHERE "product"."variant_group_id" = NEW.variant_group_id AND "product"."status" = TRUE GROUP BY "product"."variant_group_id"), FALSE) WHERE "variant_group"."variant_group_id" = NEW.variant_group_id;
        RETURN NEW;
      END;
      $$;


--
-- Name: update_product_attribute_option_value_text(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_product_attribute_option_value_text() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        UPDATE "product_attribute_value_index" SET "option_text" = NEW.option_text
        WHERE "product_attribute_value_index".option_id = NEW.attribute_option_id AND "product_attribute_value_index".attribute_id = NEW.attribute_id;
        RETURN NEW;
      END;
      $$;


--
-- Name: update_variant_group_visibility(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_variant_group_visibility() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        UPDATE "variant_group" SET visibility = (SELECT bool_or(visibility) FROM "product" WHERE "product"."variant_group_id" = NEW.variant_group_id AND "product"."status" = TRUE) WHERE "variant_group"."variant_group_id" = NEW.variant_group_id;
        RETURN NEW;
      END;
      $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_user (
    admin_user_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    status boolean DEFAULT true NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admin_user_admin_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.admin_user ALTER COLUMN admin_user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admin_user_admin_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: attribute; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute (
    attribute_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    attribute_code character varying NOT NULL,
    attribute_name character varying NOT NULL,
    type character varying NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    display_on_frontend boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_filterable boolean DEFAULT false NOT NULL
);


--
-- Name: attribute_attribute_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.attribute ALTER COLUMN attribute_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attribute_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: attribute_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute_group (
    attribute_group_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    group_name text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: attribute_group_attribute_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.attribute_group ALTER COLUMN attribute_group_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attribute_group_attribute_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: attribute_group_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute_group_link (
    attribute_group_link_id integer NOT NULL,
    attribute_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: attribute_group_link_attribute_group_link_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.attribute_group_link ALTER COLUMN attribute_group_link_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attribute_group_link_attribute_group_link_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: attribute_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute_option (
    attribute_option_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    attribute_id integer NOT NULL,
    attribute_code character varying NOT NULL,
    option_text character varying NOT NULL
);


--
-- Name: attribute_option_attribute_option_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.attribute_option ALTER COLUMN attribute_option_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attribute_option_attribute_option_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cart; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    sid character varying,
    currency character varying NOT NULL,
    customer_id integer,
    customer_group_id smallint,
    customer_email character varying,
    customer_full_name character varying,
    user_ip character varying,
    status boolean DEFAULT false NOT NULL,
    coupon character varying,
    shipping_fee_excl_tax numeric(12,4) DEFAULT NULL::numeric,
    shipping_fee_incl_tax numeric(12,4) DEFAULT NULL::numeric,
    discount_amount numeric(12,4) DEFAULT NULL::numeric,
    sub_total numeric(12,4) NOT NULL,
    sub_total_incl_tax numeric(12,4) NOT NULL,
    sub_total_with_discount numeric(12,4) NOT NULL,
    sub_total_with_discount_incl_tax numeric(12,4) NOT NULL,
    total_qty integer NOT NULL,
    total_weight numeric(12,4) DEFAULT NULL::numeric,
    tax_amount numeric(12,4) NOT NULL,
    tax_amount_before_discount numeric(12,4) NOT NULL,
    shipping_tax_amount numeric(12,4) NOT NULL,
    grand_total numeric(12,4) NOT NULL,
    shipping_method character varying,
    shipping_method_name character varying,
    shipping_zone_id integer,
    shipping_address_id integer,
    payment_method character varying,
    payment_method_name character varying,
    billing_address_id integer,
    shipping_note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    total_tax_amount numeric(12,4)
);


--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_address (
    cart_address_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying,
    postcode character varying,
    telephone character varying,
    country character varying,
    province character varying,
    city character varying,
    address_1 character varying,
    address_2 character varying
);


--
-- Name: cart_address_cart_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cart_address ALTER COLUMN cart_address_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cart_address_cart_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cart ALTER COLUMN cart_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cart_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cart_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_item (
    cart_item_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    product_sku character varying NOT NULL,
    product_name text NOT NULL,
    thumbnail character varying,
    product_weight numeric(12,4) DEFAULT NULL::numeric,
    product_price numeric(12,4) NOT NULL,
    product_price_incl_tax numeric(12,4) NOT NULL,
    qty integer NOT NULL,
    final_price numeric(12,4) NOT NULL,
    final_price_incl_tax numeric(12,4) NOT NULL,
    tax_percent numeric(12,4) NOT NULL,
    tax_amount numeric(12,4) NOT NULL,
    tax_amount_before_discount numeric(12,4) NOT NULL,
    discount_amount numeric(12,4) NOT NULL,
    line_total numeric(12,4) NOT NULL,
    line_total_with_discount numeric(12,4) NOT NULL,
    line_total_incl_tax numeric(12,4) NOT NULL,
    line_total_with_discount_incl_tax numeric(12,4) NOT NULL,
    variant_group_id integer,
    variant_options text,
    product_custom_options text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cart_item_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cart_item ALTER COLUMN cart_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cart_item_cart_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category (
    category_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    status boolean NOT NULL,
    parent_id integer,
    include_in_nav boolean NOT NULL,
    "position" smallint,
    show_products boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.category ALTER COLUMN category_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.category_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: category_description; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_description (
    category_description_id integer NOT NULL,
    category_description_category_id integer NOT NULL,
    name character varying NOT NULL,
    short_description text,
    description text,
    image character varying,
    meta_title text,
    meta_keywords text,
    meta_description text,
    url_key character varying NOT NULL
);


--
-- Name: category_description_category_description_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.category_description ALTER COLUMN category_description_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.category_description_category_description_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cms_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_page (
    cms_page_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    status boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: cms_page_cms_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cms_page ALTER COLUMN cms_page_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cms_page_cms_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cms_page_description; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_page_description (
    cms_page_description_id integer NOT NULL,
    cms_page_description_cms_page_id integer,
    url_key character varying NOT NULL,
    name character varying NOT NULL,
    content text,
    meta_title character varying,
    meta_keywords character varying,
    meta_description text
);


--
-- Name: cms_page_description_cms_page_description_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cms_page_description ALTER COLUMN cms_page_description_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cms_page_description_cms_page_description_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection (
    collection_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    code character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: collection_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.collection ALTER COLUMN collection_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.collection_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: coupon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupon (
    coupon_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    status boolean DEFAULT true NOT NULL,
    description character varying NOT NULL,
    discount_amount numeric(12,4) NOT NULL,
    free_shipping boolean DEFAULT false NOT NULL,
    discount_type character varying DEFAULT '1'::character varying NOT NULL,
    coupon character varying NOT NULL,
    used_time integer DEFAULT 0 NOT NULL,
    target_products jsonb,
    condition jsonb,
    user_condition jsonb,
    buyx_gety jsonb,
    max_uses_time_per_coupon integer,
    max_uses_time_per_customer integer,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "POSITIVE_DISCOUNT_AMOUNT" CHECK ((discount_amount >= (0)::numeric)),
    CONSTRAINT "VALID_PERCENTAGE_DISCOUNT" CHECK (((discount_amount <= (100)::numeric) OR ((discount_type)::text <> 'percentage'::text)))
);


--
-- Name: coupon_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.coupon ALTER COLUMN coupon_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.coupon_coupon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    group_id integer DEFAULT 1,
    email character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_address (
    customer_address_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id integer NOT NULL,
    full_name character varying,
    telephone character varying,
    address_1 character varying,
    address_2 character varying,
    postcode character varying,
    city character varying,
    province character varying,
    country character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_default boolean
);


--
-- Name: customer_address_customer_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.customer_address ALTER COLUMN customer_address_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_address_customer_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.customer ALTER COLUMN customer_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_group (
    customer_group_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    group_name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customer_group_customer_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.customer_group ALTER COLUMN customer_group_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_group_customer_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event (
    event_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    data json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: event_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.event ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migration (
    migration_id integer NOT NULL,
    module character varying NOT NULL,
    version character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: migration_migration_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.migration ALTER COLUMN migration_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.migration_migration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    order_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    integration_order_id character varying,
    sid character varying,
    order_number character varying NOT NULL,
    status character varying NOT NULL,
    cart_id integer NOT NULL,
    currency character varying NOT NULL,
    customer_id integer,
    customer_email character varying,
    customer_full_name character varying,
    user_ip character varying,
    user_agent character varying,
    coupon character varying,
    shipping_fee_excl_tax numeric(12,4) DEFAULT NULL::numeric,
    shipping_fee_incl_tax numeric(12,4) DEFAULT NULL::numeric,
    discount_amount numeric(12,4) DEFAULT NULL::numeric,
    sub_total numeric(12,4) NOT NULL,
    sub_total_incl_tax numeric(12,4) NOT NULL,
    sub_total_with_discount numeric(12,4) NOT NULL,
    sub_total_with_discount_incl_tax numeric(12,4) NOT NULL,
    total_qty integer NOT NULL,
    total_weight numeric(12,4) DEFAULT NULL::numeric,
    tax_amount numeric(12,4) NOT NULL,
    tax_amount_before_discount numeric(12,4) NOT NULL,
    shipping_tax_amount numeric(12,4) NOT NULL,
    shipping_note text,
    grand_total numeric(12,4) NOT NULL,
    shipping_method character varying,
    shipping_method_name character varying,
    shipping_address_id integer,
    payment_method character varying,
    payment_method_name character varying,
    billing_address_id integer,
    shipment_status character varying,
    payment_status character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    total_tax_amount numeric(12,4)
);


--
-- Name: order_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_activity (
    order_activity_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    order_activity_order_id integer NOT NULL,
    comment text NOT NULL,
    customer_notified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: order_activity_order_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.order_activity ALTER COLUMN order_activity_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_activity_order_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_address (
    order_address_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying,
    postcode character varying,
    telephone character varying,
    country character varying,
    province character varying,
    city character varying,
    address_1 character varying,
    address_2 character varying
);


--
-- Name: order_address_order_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.order_address ALTER COLUMN order_address_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_address_order_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item (
    order_item_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    order_item_order_id integer NOT NULL,
    product_id integer NOT NULL,
    referer integer,
    product_sku character varying NOT NULL,
    product_name text NOT NULL,
    thumbnail character varying,
    product_weight numeric(12,4) DEFAULT NULL::numeric,
    product_price numeric(12,4) NOT NULL,
    product_price_incl_tax numeric(12,4) NOT NULL,
    qty integer NOT NULL,
    final_price numeric(12,4) NOT NULL,
    final_price_incl_tax numeric(12,4) NOT NULL,
    tax_percent numeric(12,4) NOT NULL,
    tax_amount numeric(12,4) NOT NULL,
    tax_amount_before_discount numeric(12,4) NOT NULL,
    discount_amount numeric(12,4) NOT NULL,
    line_total numeric(12,4) NOT NULL,
    line_total_with_discount numeric(12,4) NOT NULL,
    line_total_incl_tax numeric(12,4) NOT NULL,
    line_total_with_discount_incl_tax numeric(12,4) NOT NULL,
    variant_group_id integer,
    variant_options text,
    product_custom_options text,
    requested_data text
);


--
-- Name: order_item_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.order_item ALTER COLUMN order_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_item_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."order" ALTER COLUMN order_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.order_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: payment_transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_transaction (
    payment_transaction_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    payment_transaction_order_id integer NOT NULL,
    transaction_id character varying,
    transaction_type character varying NOT NULL,
    amount numeric(12,4) NOT NULL,
    parent_transaction_id character varying,
    payment_action character varying,
    additional_information text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: payment_transaction_payment_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.payment_transaction ALTER COLUMN payment_transaction_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payment_transaction_payment_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    product_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying DEFAULT 'simple'::character varying NOT NULL,
    variant_group_id integer,
    visibility boolean DEFAULT true NOT NULL,
    group_id integer DEFAULT 1,
    sku character varying NOT NULL,
    price numeric(12,4) NOT NULL,
    weight numeric(12,4) DEFAULT NULL::numeric,
    tax_class smallint,
    status boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer,
    CONSTRAINT "UNSIGNED_PRICE" CHECK ((price >= (0)::numeric)),
    CONSTRAINT "UNSIGNED_WEIGHT" CHECK ((weight >= (0)::numeric))
);


--
-- Name: product_attribute_value_index; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_attribute_value_index (
    product_attribute_value_index_id integer NOT NULL,
    product_id integer NOT NULL,
    attribute_id integer NOT NULL,
    option_id integer,
    option_text text
);


--
-- Name: product_attribute_value_index_product_attribute_value_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_attribute_value_index ALTER COLUMN product_attribute_value_index_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_attribute_value_index_product_attribute_value_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_collection (
    product_collection_id integer NOT NULL,
    collection_id integer NOT NULL,
    product_id integer NOT NULL
);


--
-- Name: product_collection_product_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_collection ALTER COLUMN product_collection_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_collection_product_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_custom_option; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_custom_option (
    product_custom_option_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    product_custom_option_product_id integer NOT NULL,
    option_name character varying NOT NULL,
    option_type character varying NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    sort_order integer
);


--
-- Name: product_custom_option_product_custom_option_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_custom_option ALTER COLUMN product_custom_option_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_custom_option_product_custom_option_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_custom_option_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_custom_option_value (
    product_custom_option_value_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    option_id integer NOT NULL,
    extra_price numeric(12,4) DEFAULT NULL::numeric,
    sort_order integer,
    value character varying NOT NULL
);


--
-- Name: product_custom_option_value_product_custom_option_value_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_custom_option_value ALTER COLUMN product_custom_option_value_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_custom_option_value_product_custom_option_value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_description; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_description (
    product_description_id integer NOT NULL,
    product_description_product_id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    short_description text,
    url_key character varying NOT NULL,
    meta_title text,
    meta_description text,
    meta_keywords text
);


--
-- Name: product_description_product_description_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_description ALTER COLUMN product_description_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_description_product_description_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_image (
    product_image_id integer NOT NULL,
    product_image_product_id integer NOT NULL,
    origin_image character varying NOT NULL,
    thumb_image text,
    listing_image text,
    single_image text,
    is_main boolean DEFAULT false
);


--
-- Name: product_image_product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_image ALTER COLUMN product_image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_image_product_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_inventory (
    product_inventory_id integer NOT NULL,
    product_inventory_product_id integer NOT NULL,
    qty integer DEFAULT 0 NOT NULL,
    manage_stock boolean DEFAULT false NOT NULL,
    stock_availability boolean DEFAULT false NOT NULL
);


--
-- Name: product_inventory_product_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product_inventory ALTER COLUMN product_inventory_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_inventory_product_inventory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.product ALTER COLUMN product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.product_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reset_password_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reset_password_token (
    reset_password_token_id integer NOT NULL,
    customer_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reset_password_token_reset_password_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reset_password_token ALTER COLUMN reset_password_token_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reset_password_token_reset_password_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setting (
    setting_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    value text,
    is_json boolean DEFAULT false NOT NULL
);


--
-- Name: setting_setting_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.setting ALTER COLUMN setting_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.setting_setting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment (
    shipment_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    shipment_order_id integer NOT NULL,
    carrier character varying,
    tracking_number character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: shipment_shipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shipment ALTER COLUMN shipment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipment_shipment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipping_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_method (
    shipping_method_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL
);


--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shipping_method ALTER COLUMN shipping_method_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipping_method_shipping_method_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipping_zone; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zone (
    shipping_zone_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    country character varying NOT NULL
);


--
-- Name: shipping_zone_method; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zone_method (
    shipping_zone_method_id integer NOT NULL,
    method_id integer NOT NULL,
    zone_id integer NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    cost numeric(12,4) DEFAULT NULL::numeric,
    calculate_api character varying,
    condition_type character varying,
    max numeric(12,4) DEFAULT NULL::numeric,
    min numeric(12,4) DEFAULT NULL::numeric,
    price_based_cost jsonb,
    weight_based_cost jsonb
);


--
-- Name: shipping_zone_method_shipping_zone_method_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shipping_zone_method ALTER COLUMN shipping_zone_method_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipping_zone_method_shipping_zone_method_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipping_zone_province; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zone_province (
    shipping_zone_province_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    zone_id integer NOT NULL,
    province character varying NOT NULL
);


--
-- Name: shipping_zone_province_shipping_zone_province_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shipping_zone_province ALTER COLUMN shipping_zone_province_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipping_zone_province_shipping_zone_province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipping_zone_shipping_zone_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.shipping_zone ALTER COLUMN shipping_zone_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipping_zone_shipping_zone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tax_class; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_class (
    tax_class_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL
);


--
-- Name: tax_class_tax_class_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tax_class ALTER COLUMN tax_class_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tax_class_tax_class_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_rate (
    tax_rate_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    tax_class_id integer,
    country character varying DEFAULT '*'::character varying NOT NULL,
    province character varying DEFAULT '*'::character varying NOT NULL,
    postcode character varying DEFAULT '*'::character varying NOT NULL,
    rate numeric(12,4) NOT NULL,
    is_compound boolean DEFAULT false NOT NULL,
    priority integer NOT NULL,
    CONSTRAINT "UNSIGNED_PRIORITY" CHECK ((priority >= 0)),
    CONSTRAINT "UNSIGNED_RATE" CHECK ((rate >= (0)::numeric))
);


--
-- Name: tax_rate_tax_rate_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tax_rate ALTER COLUMN tax_rate_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tax_rate_tax_rate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: url_rewrite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.url_rewrite (
    url_rewrite_id integer NOT NULL,
    language character varying DEFAULT 'en'::character varying NOT NULL,
    request_path character varying NOT NULL,
    target_path character varying NOT NULL,
    entity_uuid uuid,
    entity_type character varying
);


--
-- Name: url_rewrite_url_rewrite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.url_rewrite ALTER COLUMN url_rewrite_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.url_rewrite_url_rewrite_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: variant_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_group (
    variant_group_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    attribute_group_id integer NOT NULL,
    attribute_one integer,
    attribute_two integer,
    attribute_three integer,
    attribute_four integer,
    attribute_five integer,
    visibility boolean DEFAULT false NOT NULL
);


--
-- Name: variant_group_variant_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.variant_group ALTER COLUMN variant_group_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.variant_group_variant_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: widget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widget (
    widget_id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    route jsonb DEFAULT '[]'::jsonb NOT NULL,
    area jsonb DEFAULT '[]'::jsonb NOT NULL,
    sort_order integer DEFAULT 1 NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    status boolean,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: widget_widget_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.widget ALTER COLUMN widget_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.widget_widget_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: admin_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_user (admin_user_id, uuid, status, email, password, full_name, created_at, updated_at) FROM stdin;
1	ba023ece-5809-4dfc-b201-9e1cc6a50015	t	admin@admin.com	$2a$10$K/FtH3H8uHJR6K1rEcxcUO5i4syXjJPfnAwXXypD9aSWjMtNnKEaq	matías	2025-05-16 16:07:12.102131-03	2025-05-16 16:07:12.102131-03
2	08f27de9-08b0-447f-b238-30ca664d5c75	t	admin@example.com	$2a$10$JWg1y2H9TCqNuKYSoLUBVOwVwnjvN4WxLiioMYR.w5EBfVA/zNlX.	Admin Name	2025-05-23 12:42:44.002707-03	2025-05-23 12:42:44.002707-03
\.


--
-- Data for Name: attribute; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attribute (attribute_id, uuid, attribute_code, attribute_name, type, is_required, display_on_frontend, sort_order, is_filterable) FROM stdin;
1	f18e5b20-50ef-44fd-b9ca-c02a0fb781ea	color	Color	select	f	t	0	t
2	ca72044c-633c-41aa-85f6-a0b566a5b91c	size	Size	select	f	t	0	t
\.


--
-- Data for Name: attribute_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attribute_group (attribute_group_id, uuid, group_name, created_at, updated_at) FROM stdin;
1	0bb919c7-2e86-4059-a51a-d5927fbdcb0d	Default	2025-05-16 16:07:34.382052-03	2025-05-16 16:07:34.382052-03
\.


--
-- Data for Name: attribute_group_link; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attribute_group_link (attribute_group_link_id, attribute_id, group_id) FROM stdin;
1	1	1
2	2	1
\.


--
-- Data for Name: attribute_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attribute_option (attribute_option_id, uuid, attribute_id, attribute_code, option_text) FROM stdin;
1	6ba42348-dc8a-4f07-b8e4-d4281332dfa7	1	color	White
2	4833c2eb-2196-44f5-91d4-6f93911346e1	1	color	Black
3	08fa5a3d-b85d-48aa-be44-ba2b462d80d0	1	color	Yellow
4	b8941f42-9990-4267-88c0-8137f36c849c	2	size	XXL
5	ce338753-0e7d-43de-89ec-f766d9a679ee	2	size	XL
6	257751e5-a88c-4ece-a94d-5c233c24d6da	2	size	SM
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart (cart_id, uuid, sid, currency, customer_id, customer_group_id, customer_email, customer_full_name, user_ip, status, coupon, shipping_fee_excl_tax, shipping_fee_incl_tax, discount_amount, sub_total, sub_total_incl_tax, sub_total_with_discount, sub_total_with_discount_incl_tax, total_qty, total_weight, tax_amount, tax_amount_before_discount, shipping_tax_amount, grand_total, shipping_method, shipping_method_name, shipping_zone_id, shipping_address_id, payment_method, payment_method_name, billing_address_id, shipping_note, created_at, updated_at, total_tax_amount) FROM stdin;
1	884c5cd2-5b8e-49d0-a308-2be4fb8035a9	vimpRKJ_Pr4GOMwitjIj5CtJKodJH98-	USD	\N	\N	matiselt@outlook.es	\N	\N	t	\N	0.0000	0.0000	0.0000	90.0000	90.0000	90.0000	90.0000	1	90.0000	0.0000	0.0000	0.0000	90.0000	\N	\N	\N	\N	\N	\N	\N	\N	2025-05-20 19:14:14.495711-03	2025-05-20 19:14:14.495711-03	0.0000
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_address (cart_address_id, uuid, full_name, postcode, telephone, country, province, city, address_1, address_2) FROM stdin;
\.


--
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_item (cart_item_id, uuid, cart_id, product_id, product_sku, product_name, thumbnail, product_weight, product_price, product_price_incl_tax, qty, final_price, final_price_incl_tax, tax_percent, tax_amount, tax_amount_before_discount, discount_amount, line_total, line_total_with_discount, line_total_incl_tax, line_total_with_discount_incl_tax, variant_group_id, variant_options, product_custom_options, created_at, updated_at) FROM stdin;
1	5c6882b5-823d-4c2f-87f3-552fa3c4348b	1	4	SCS-24680	Striped Cotton Sweater	\N	90.0000	90.0000	90.0000	1	90.0000	90.0000	0.0000	0.0000	0.0000	0.0000	90.0000	90.0000	90.0000	90.0000	\N	\N	\N	2025-05-20 19:14:14.495711-03	2025-05-20 19:14:14.495711-03
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category (category_id, uuid, status, parent_id, include_in_nav, "position", show_products, created_at, updated_at) FROM stdin;
1	3bd6dd12-9d8e-4336-bb07-c7ca2e0e5e0b	t	\N	t	\N	t	2025-05-16 16:07:34.382052-03	2025-05-16 16:07:34.382052-03
2	2c3cde5e-80e8-42a9-9477-53a63562c413	t	\N	t	\N	t	2025-05-16 16:07:34.382052-03	2025-05-16 16:07:34.382052-03
3	0dfc63fe-78d9-431c-9c0c-2728b04b3b55	t	\N	t	\N	t	2025-05-16 16:07:34.382052-03	2025-05-16 16:07:34.382052-03
\.


--
-- Data for Name: category_description; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category_description (category_description_id, category_description_category_id, name, short_description, description, image, meta_title, meta_keywords, meta_description, url_key) FROM stdin;
1	1	Kids	\N	Kids	\N	Kids	Kids	Kids	kids
2	2	Women	\N	Women	\N	Women	Women	Women	women
3	3	Men	\N	Men	\N	Men	Men	Men	men
\.


--
-- Data for Name: cms_page; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cms_page (cms_page_id, uuid, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: cms_page_description; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cms_page_description (cms_page_description_id, cms_page_description_cms_page_id, url_key, name, content, meta_title, meta_keywords, meta_description) FROM stdin;
\.


--
-- Data for Name: collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.collection (collection_id, uuid, name, description, code, created_at, updated_at) FROM stdin;
1	33fce9a5-52a2-4be3-8393-369e35e6ed98	Featured Products	\N	homepage	2025-05-16 16:07:34.712093-03	2025-05-16 16:07:34.712093-03
\.


--
-- Data for Name: coupon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupon (coupon_id, uuid, status, description, discount_amount, free_shipping, discount_type, coupon, used_time, target_products, condition, user_condition, buyx_gety, max_uses_time_per_coupon, max_uses_time_per_customer, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer (customer_id, uuid, status, group_id, email, password, full_name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_address (customer_address_id, uuid, customer_id, full_name, telephone, address_1, address_2, postcode, city, province, country, created_at, updated_at, is_default) FROM stdin;
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_group (customer_group_id, uuid, group_name, created_at, updated_at) FROM stdin;
1	9ec7c8ab-636b-42e6-a658-3ccd91d38652	Default	2025-05-16 16:07:35.103364-03	2025-05-16 16:07:35.103364-03
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event (event_id, uuid, name, data, created_at) FROM stdin;
\.


--
-- Data for Name: migration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migration (migration_id, module, version, created_at, updated_at) FROM stdin;
1	auth	1.0.1	2025-05-16 16:07:34.303879-03	2025-05-16 16:07:34.303879-03
3	base	1.0.1	2025-05-16 16:07:34.362296-03	2025-05-16 16:07:34.362296-03
4	catalog	1.0.7	2025-05-16 16:07:34.382052-03	2025-05-16 16:07:34.382052-03
12	checkout	1.0.6	2025-05-16 16:07:34.852868-03	2025-05-16 16:07:34.852868-03
19	cms	1.1.1	2025-05-16 16:07:35.043518-03	2025-05-16 16:07:35.043518-03
22	customer	1.0.3	2025-05-16 16:07:35.103364-03	2025-05-16 16:07:35.103364-03
26	oms	1.0.1	2025-05-16 16:07:35.180028-03	2025-05-16 16:07:35.180028-03
28	promotion	1.0.1	2025-05-16 16:07:35.20406-03	2025-05-16 16:07:35.20406-03
30	setting	1.0.0	2025-05-16 16:07:35.270401-03	2025-05-16 16:07:35.270401-03
31	tax	1.0.0	2025-05-16 16:07:35.28808-03	2025-05-16 16:07:35.28808-03
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."order" (order_id, uuid, integration_order_id, sid, order_number, status, cart_id, currency, customer_id, customer_email, customer_full_name, user_ip, user_agent, coupon, shipping_fee_excl_tax, shipping_fee_incl_tax, discount_amount, sub_total, sub_total_incl_tax, sub_total_with_discount, sub_total_with_discount_incl_tax, total_qty, total_weight, tax_amount, tax_amount_before_discount, shipping_tax_amount, shipping_note, grand_total, shipping_method, shipping_method_name, shipping_address_id, payment_method, payment_method_name, billing_address_id, shipment_status, payment_status, created_at, updated_at, total_tax_amount) FROM stdin;
\.


--
-- Data for Name: order_activity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_activity (order_activity_id, uuid, order_activity_order_id, comment, customer_notified, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_address (order_address_id, uuid, full_name, postcode, telephone, country, province, city, address_1, address_2) FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_item (order_item_id, uuid, order_item_order_id, product_id, referer, product_sku, product_name, thumbnail, product_weight, product_price, product_price_incl_tax, qty, final_price, final_price_incl_tax, tax_percent, tax_amount, tax_amount_before_discount, discount_amount, line_total, line_total_with_discount, line_total_incl_tax, line_total_with_discount_incl_tax, variant_group_id, variant_options, product_custom_options, requested_data) FROM stdin;
\.


--
-- Data for Name: payment_transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_transaction (payment_transaction_id, uuid, payment_transaction_order_id, transaction_id, transaction_type, amount, parent_transaction_id, payment_action, additional_information, created_at) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product (product_id, uuid, type, variant_group_id, visibility, group_id, sku, price, weight, tax_class, status, created_at, updated_at, category_id) FROM stdin;
1	1be1243a-e1ac-4e85-8578-b1938e7088b8	simple	\N	t	1	FMD-12345	100.0000	100.0000	\N	t	2025-05-16 16:07:34.712093-03	2025-05-16 16:07:34.712093-03	\N
2	06638c4d-0ff8-45f2-8104-8ff18b50b4c8	simple	\N	t	1	CLL-98765	120.0000	120.0000	\N	t	2025-05-16 16:07:34.712093-03	2025-05-16 16:07:34.712093-03	\N
3	6e064368-b220-4a1b-86d0-3e946c056e85	simple	\N	t	1	DSJ-54321	120.0000	120.0000	\N	t	2025-05-16 16:07:34.712093-03	2025-05-16 16:07:34.712093-03	\N
4	b33495d3-5d0e-4e51-a2ab-32086b654ac7	simple	\N	t	1	SCS-24680	90.0000	90.0000	\N	t	2025-05-16 16:07:34.712093-03	2025-05-16 16:07:34.712093-03	\N
\.


--
-- Data for Name: product_attribute_value_index; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_attribute_value_index (product_attribute_value_index_id, product_id, attribute_id, option_id, option_text) FROM stdin;
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_collection (product_collection_id, collection_id, product_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
\.


--
-- Data for Name: product_custom_option; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_custom_option (product_custom_option_id, uuid, product_custom_option_product_id, option_name, option_type, is_required, sort_order) FROM stdin;
\.


--
-- Data for Name: product_custom_option_value; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_custom_option_value (product_custom_option_value_id, uuid, option_id, extra_price, sort_order, value) FROM stdin;
\.


--
-- Data for Name: product_description; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_description (product_description_id, product_description_product_id, name, description, short_description, url_key, meta_title, meta_description, meta_keywords) FROM stdin;
1	1	Floral Maxi Dress	Embrace the beauty of nature with our Floral Maxi Dress. This flowing dress features a stunning floral pattern that captures the essence of a blossoming garden. The lightweight fabric ensures comfort and breathability, making it perfect for both casual outings and special occasions. The dress is designed with a cinched waist and a v-neckline for a flattering silhouette. Elevate your style with this elegant and vibrant piece.	\N	floral-maxi-dress	Floral Maxi Dress	Floral Maxi Dress	Floral Maxi Dress
2	2	Classic Leather Loafers	Step into timeless elegance with our Classic Leather Loafers. Crafted from premium genuine leather, these loafers offer both style and comfort. The traditional design features a sleek and simple silhouette that pairs effortlessly with both formal and casual attire. The cushioned insole provides all-day support, making these loafers a versatile addition to your footwear collection.	\N	classic-leather-loafers	Classic Leather Loafers	Classic Leather Loafers	Classic Leather Loafers
3	3	Denim Skinny Jeans	Experience the perfect blend of style and comfort with our Denim Skinny Jeans. These jeans are designed to hug your curves while allowing for ease of movement. The high-quality denim fabric offers durability and a flattering fit. The classic five-pocket design adds a touch of versatility, making these jeans a wardrobe staple for various occasions.	\N	denim-skinny-jeans	Denim Skinny Jeans	Denim Skinny Jeans	Denim Skinny Jeans
4	4	Striped Cotton Sweater	Stay cozy and chic with our Striped Cotton Sweater. This lightweight sweater features a timeless striped pattern that adds a pop of style to your outfit. The breathable cotton fabric makes it an excellent choice for layering during transitional seasons. The relaxed fit and ribbed cuffs ensure a comfortable and flattering look, whether you're lounging at home or going out for a casual day.	\N	striped-cotton-sweater	Striped Cotton Sweater	Striped Cotton Sweater	Striped Cotton Sweater
\.


--
-- Data for Name: product_image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_image (product_image_id, product_image_product_id, origin_image, thumb_image, listing_image, single_image, is_main) FROM stdin;
\.


--
-- Data for Name: product_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_inventory (product_inventory_id, product_inventory_product_id, qty, manage_stock, stock_availability) FROM stdin;
1	1	100	t	t
2	2	120	t	t
3	3	90	t	t
4	4	150	t	t
\.


--
-- Data for Name: reset_password_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reset_password_token (reset_password_token_id, customer_id, token, created_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (sid, sess, expire) FROM stdin;
fdR8mWyUDU3kxEFCq5kDKjEGis-rVZ-P	{"cookie":{"originalMaxAge":86400000,"expires":"2025-06-20T17:45:01.521Z","httpOnly":true,"path":"/"},"notifications":[]}	2025-06-20 17:54:20
jFdj58OYGO3MLY0Zaac3xoVBar0ZQ13P	{"cookie":{"originalMaxAge":86400000,"expires":"2025-06-20T17:45:33.412Z","httpOnly":true,"path":"/"},"notifications":[],"userID":2}	2025-06-20 17:53:20
\.


--
-- Data for Name: setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.setting (setting_id, uuid, name, value, is_json) FROM stdin;
1	491a706b-7fa7-4fff-a722-e54d4e81b04e	storeName	An Amazing Ushuaia Extremo Store	f
2	2341ef11-2c04-40ce-9ff2-eec1797ea27c	storeDescription	An Amazing Ushuaia Extremo Store	f
3	f7582bfa-987d-4b83-af90-458e89ab561b	storePhoneNumber		f
4	a2613bdb-fcec-462e-a511-aba855c8e284	storeEmail		f
5	0e690f8f-38e7-448a-84d1-7ac7251e3983	storeCountry	AR	f
6	4441cda8-7876-4582-b5b6-361b89622100	storeAddress	San martin 1354	f
7	e68fcf2c-4ec1-443e-b45f-252c6cef82eb	storeCity	Ushuaia	f
8	beca7462-14fe-4fea-aeaa-bf73fb9fd03a	storeProvince	AR-V	f
9	121c70ed-f6a2-4d84-90cf-caa9c55c5544	storePostalCode	9410	f
\.


--
-- Data for Name: shipment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipment (shipment_id, uuid, shipment_order_id, carrier, tracking_number, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipping_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_method (shipping_method_id, uuid, name) FROM stdin;
\.


--
-- Data for Name: shipping_zone; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_zone (shipping_zone_id, uuid, name, country) FROM stdin;
\.


--
-- Data for Name: shipping_zone_method; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_zone_method (shipping_zone_method_id, method_id, zone_id, is_enabled, cost, calculate_api, condition_type, max, min, price_based_cost, weight_based_cost) FROM stdin;
\.


--
-- Data for Name: shipping_zone_province; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_zone_province (shipping_zone_province_id, uuid, zone_id, province) FROM stdin;
\.


--
-- Data for Name: tax_class; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_class (tax_class_id, uuid, name) FROM stdin;
1	c2d789e8-3613-4bf3-a005-13d0fc9c6640	Taxable Goods
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_rate (tax_rate_id, uuid, name, tax_class_id, country, province, postcode, rate, is_compound, priority) FROM stdin;
1	f243f057-2633-41b7-83ee-a97e2f4dc3ec	Tax	1	*	*	*	0.0000	f	0
\.


--
-- Data for Name: url_rewrite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.url_rewrite (url_rewrite_id, language, request_path, target_path, entity_uuid, entity_type) FROM stdin;
1	en	/kids	/category/3bd6dd12-9d8e-4336-bb07-c7ca2e0e5e0b	3bd6dd12-9d8e-4336-bb07-c7ca2e0e5e0b	category
2	en	/women	/category/2c3cde5e-80e8-42a9-9477-53a63562c413	2c3cde5e-80e8-42a9-9477-53a63562c413	category
3	en	/men	/category/0dfc63fe-78d9-431c-9c0c-2728b04b3b55	0dfc63fe-78d9-431c-9c0c-2728b04b3b55	category
4	en	/floral-maxi-dress	/product/1be1243a-e1ac-4e85-8578-b1938e7088b8	1be1243a-e1ac-4e85-8578-b1938e7088b8	product
5	en	/classic-leather-loafers	/product/06638c4d-0ff8-45f2-8104-8ff18b50b4c8	06638c4d-0ff8-45f2-8104-8ff18b50b4c8	product
6	en	/denim-skinny-jeans	/product/6e064368-b220-4a1b-86d0-3e946c056e85	6e064368-b220-4a1b-86d0-3e946c056e85	product
7	en	/striped-cotton-sweater	/product/b33495d3-5d0e-4e51-a2ab-32086b654ac7	b33495d3-5d0e-4e51-a2ab-32086b654ac7	product
\.


--
-- Data for Name: variant_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_group (variant_group_id, uuid, attribute_group_id, attribute_one, attribute_two, attribute_three, attribute_four, attribute_five, visibility) FROM stdin;
\.


--
-- Data for Name: widget; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.widget (widget_id, uuid, name, type, route, area, sort_order, settings, status, created_at, updated_at) FROM stdin;
1	cf750467-41db-4915-90d5-a67ebcb17c46	Main menu	basic_menu	[]	[]	1	{"menus": [{"id": "hanhk3km0m8nt2b", "url": "javascript:void(0)", "name": "Shop ❤️", "type": "custom", "uuid": "javascript:void(0)", "children": [{"id": "hanhk3km0m8nt2c", "url": "/men", "name": "Men", "type": "custom", "uuid": "/men"}, {"id": "hanhk3km0m8nt2d", "url": "/women", "name": "Women", "type": "custom", "uuid": "/women"}]}, {"id": "hanhk3km0m8nt2e", "url": "/page/about-us", "name": "About us", "type": "custom", "uuid": "/page/about-us", "children": []}], "isMain": "1", "className": ""}	f	2025-05-16 16:07:35.089702-03	2025-05-16 16:07:35.089702-03
2	8b6adb9e-a924-40cd-85a2-ca9cf939e3f8	Featured categories	text_block	[]	[]	10	{"text": "[{\\"id\\":\\"r__c13ffd49-f39e-40d7-8d67-d345c0a018c1\\",\\"size\\":3,\\"columns\\":[{\\"id\\":\\"c__6dffc7a4-4378-4247-8ffd-07d956ce4939\\",\\"size\\":1,\\"data\\":{\\"time\\":1725357550597,\\"blocks\\":[{\\"id\\":\\"PjJh9eW0O7\\",\\"type\\":\\"header\\",\\"data\\":{\\"text\\":\\"Kids shoes collection\\",\\"level\\":3}},{\\"id\\":\\"CHsT6VaRCw\\",\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.\\"}},{\\"id\\":\\"-0lRctONo9\\",\\"type\\":\\"raw\\",\\"data\\":{\\"html\\":\\"&lt;a href=\\\\\\"/kids\\\\\\" class=\\\\\\"button primary\\\\\\"&gt;&lt;span&gt;Shop kids&lt;/span&gt;&lt;/a&gt;\\"}}],\\"version\\":\\"2.30.2\\"}},{\\"id\\":\\"c__ca76b2e3-65e3-4eb3-83cb-7ffdfba41208\\",\\"size\\":1,\\"data\\":{\\"time\\":1725357550599,\\"blocks\\":[{\\"id\\":\\"2K_v3fp7Dd\\",\\"type\\":\\"header\\",\\"data\\":{\\"text\\":\\"Women shoes collection\\",\\"level\\":3}},{\\"id\\":\\"XiPHWtWbZm\\",\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.\\"}},{\\"id\\":\\"f9KXlEkYmu\\",\\"type\\":\\"raw\\",\\"data\\":{\\"html\\":\\"&lt;a href=\\\\\\"/women\\\\\\" class=\\\\\\"button primary\\\\\\"&gt;&lt;span&gt;Shop women&lt;/span&gt;&lt;/a&gt;\\"}}],\\"version\\":\\"2.30.2\\"}},{\\"id\\":\\"c__2872ebd9-7f79-442b-bade-6c19d74220ef\\",\\"size\\":1,\\"data\\":{\\"time\\":1725357550612,\\"blocks\\":[{\\"id\\":\\"mxTqYRjSTw\\",\\"type\\":\\"header\\",\\"data\\":{\\"text\\":\\"Men shoes collection\\",\\"level\\":3}},{\\"id\\":\\"p-frIk8CU-\\",\\"type\\":\\"paragraph\\",\\"data\\":{\\"text\\":\\"Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.\\"}},{\\"id\\":\\"AoCaoHwyWd\\",\\"type\\":\\"raw\\",\\"data\\":{\\"html\\":\\"&lt;a href=\\\\\\"/men\\\\\\" class=\\\\\\"button primary\\\\\\"&gt;&lt;span&gt;Shop men&lt;/span&gt;&lt;/a&gt;\\"}}],\\"version\\":\\"2.30.2\\"}}]}]", "className": "page-width"}	f	2025-05-16 16:07:35.089702-03	2025-05-16 16:07:35.089702-03
3	71ee4980-2122-4b69-8e60-466b148ca046	Featured Products	collection_products	[]	[]	20	{"count": 4, "collection": "homepage"}	f	2025-05-16 16:07:35.089702-03	2025-05-16 16:07:35.089702-03
4	8abec8a9-f12d-4a22-9a64-b40eb76aafba	Main banner	text_block	[]	[]	5	{"text": "[{\\"id\\":\\"r__63dcb2ab-c2a4-40fc-a995-105bf1484b06\\",\\"size\\":1,\\"columns\\":[{\\"id\\":\\"c__354832f1-6fe1-4845-8cbb-7e094082810e\\",\\"size\\":1,\\"data\\":{\\"time\\":1725374404621,\\"blocks\\":[{\\"id\\":\\"KRtRWBBVvm\\",\\"type\\":\\"raw\\",\\"data\\":{\\"html\\":\\"&lt;div style=\\\\\\"height: 500px; margin-top: -3rem; background: linear-gradient(135deg, #aad3ff, #0056b3); display: flex; align-items: center; justify-content: center;\\\\\\"&gt;\\\\n  &lt;div style=\\\\\\"display: flex; align-items: center; max-width: 1200px; width: 100%; padding: 0 20px;\\\\\\"&gt;\\\\n    &lt;div style=\\\\\\"flex: 1; text-align: center;\\\\\\"&gt;\\\\n      &lt;svg width=\\\\\\"300\\\\\\" height=\\\\\\"300\\\\\\" viewBox=\\\\\\"0 0 128 146\\\\\\" fill=\\\\\\"none\\\\\\" xmlns=\\\\\\"http://www.w3.org/2000/svg\\\\\\" style=\\\\\\"fill: #0056b3; color: #0056b3;\\\\\\"&gt;\\\\n        &lt;path d=\\\\\\"M32.388 18.0772L1.15175 36.1544L1.05206 72.5081L0.985596 108.895L32.4213 127.039C49.7009 137.008 63.9567 145.182 64.1228 145.182C64.289 145.182 72.8956 140.264 83.2966 134.283C93.6644 128.268 107.82 120.127 114.732 116.139L127.26 108.895V101.119V93.3102L126.529 93.7089C126.097 93.9415 111.941 102.083 95.06 111.853C78.1459 121.622 64.156 129.531 63.9567 129.498C63.724 129.431 52.5587 123.051 39.1005 115.275L14.6099 101.152V72.5746V43.9967L25.6756 37.6165C31.7234 34.1274 42.8223 27.7472 50.2991 23.4273C57.7426 19.1073 63.9899 15.585 64.1228 15.585C64.2557 15.585 72.9288 20.5362 83.3963 26.5841L113.902 43.9967L118.713 41.1657L127.26 36.1544L113.902 28.5447C103.334 22.2974 64.3554 -0.033191 64.0231 3.90721e-05C63.8237 3.90721e-05 49.568 8.14142 32.388 18.0772Z\\\\\\" fill=\\\\\\"#0056b3\\\\\\"&gt;&lt;/path&gt;\\\\n        &lt;path d=\\\\\\"M96.0237 54.1983C78.9434 64.0677 64.721 72.2423 64.4219 72.3088C64.0896 72.4084 55.7488 67.7562 44.8826 61.509L25.9082 50.543V58.4186L25.9414 66.2609L44.3841 76.8945C54.5193 82.743 63.1591 87.6611 63.5911 87.8272C64.2557 88.0598 68.9079 85.5011 95.5585 70.1156C112.705 60.1798 126.861 51.9719 127.027 51.839C127.16 51.7061 127.227 48.1505 127.194 43.9302L127.094 36.2541L96.0237 54.1983Z\\\\\\" fill=\\\\\\"#0056b3\\\\\\"&gt;&lt;/path&gt;\\\\n        &lt;path d=\\\\\\"M123.771 66.7261C121.943 67.7562 107.854 75.8976 92.4349 84.8033C77.0161 93.7089 64.289 100.986 64.1228 100.986C63.9567 100.986 55.3501 96.0683 44.9491 90.0869L26.0744 79.1874L25.9747 86.8303C25.9082 92.6788 26.0079 94.5729 26.307 94.872C26.9383 95.4369 63.7241 116.604 64.1228 116.604C64.4551 116.604 126.496 80.8821 127.027 80.4169C127.16 80.284 127.227 76.7284 127.194 72.4749L127.094 64.7987L123.771 66.7261Z\\\\\\" fill=\\\\\\"#0056b3\\\\\\"&gt;&lt;/path&gt;\\\\n      &lt;/svg&gt;\\\\n    &lt;/div&gt;\\\\n    \\\\n    &lt;div style=\\\\\\"flex: 1; text-align: left; padding: 20px;\\\\\\"&gt;\\\\n      <h1 style=\\\\\\"font-size: 3.5rem; color: #fff;\\\\\\">Your Heading Here</h1>\\\\n      &lt;p style=\\\\\\"font-size: 1.5rem; color: #fff; margin: 20px 0;\\\\\\"&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies sodales mi, at ornare elit semper ac.&lt;/p&gt;\\\\n      &lt;a href=\\\\\\"#\\\\\\" style=\\\\\\"display: inline-block; padding: 10px 20px; background-color: #fff; color: #0056b3; text-decoration: none; border-radius: 5px; font-weight: bold;\\\\\\"&gt;SHOP NOW&lt;/a&gt;\\\\n    &lt;/div&gt;\\\\n  &lt;/div&gt;\\\\n&lt;/div&gt;\\\\n\\"}}],\\"version\\":\\"2.30.2\\"}}]}]", "className": ""}	f	2025-05-16 16:07:35.089702-03	2025-05-16 16:07:35.089702-03
\.


--
-- Name: admin_user_admin_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_user_admin_user_id_seq', 5, true);


--
-- Name: attribute_attribute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attribute_attribute_id_seq', 2, true);


--
-- Name: attribute_group_attribute_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attribute_group_attribute_group_id_seq', 1, true);


--
-- Name: attribute_group_link_attribute_group_link_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attribute_group_link_attribute_group_link_id_seq', 2, true);


--
-- Name: attribute_option_attribute_option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attribute_option_attribute_option_id_seq', 6, true);


--
-- Name: cart_address_cart_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_address_cart_address_id_seq', 1, false);


--
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 1, true);


--
-- Name: cart_item_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_item_cart_item_id_seq', 1, true);


--
-- Name: category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.category_category_id_seq', 3, true);


--
-- Name: category_description_category_description_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.category_description_category_description_id_seq', 3, true);


--
-- Name: cms_page_cms_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cms_page_cms_page_id_seq', 1, false);


--
-- Name: cms_page_description_cms_page_description_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cms_page_description_cms_page_description_id_seq', 1, false);


--
-- Name: collection_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.collection_collection_id_seq', 1, true);


--
-- Name: coupon_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupon_coupon_id_seq', 1, false);


--
-- Name: customer_address_customer_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_address_customer_address_id_seq', 1, false);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 1, false);


--
-- Name: customer_group_customer_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_group_customer_group_id_seq', 1, true);


--
-- Name: event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.event_event_id_seq', 7, true);


--
-- Name: migration_migration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migration_migration_id_seq', 31, true);


--
-- Name: order_activity_order_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_activity_order_activity_id_seq', 1, false);


--
-- Name: order_address_order_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_address_order_address_id_seq', 1, false);


--
-- Name: order_item_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_item_order_item_id_seq', 1, false);


--
-- Name: order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_order_id_seq', 1, false);


--
-- Name: payment_transaction_payment_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_transaction_payment_transaction_id_seq', 1, false);


--
-- Name: product_attribute_value_index_product_attribute_value_index_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_attribute_value_index_product_attribute_value_index_seq', 1, false);


--
-- Name: product_collection_product_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_collection_product_collection_id_seq', 4, true);


--
-- Name: product_custom_option_product_custom_option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_custom_option_product_custom_option_id_seq', 1, false);


--
-- Name: product_custom_option_value_product_custom_option_value_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_custom_option_value_product_custom_option_value_id_seq', 1, false);


--
-- Name: product_description_product_description_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_description_product_description_id_seq', 4, true);


--
-- Name: product_image_product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_image_product_image_id_seq', 1, false);


--
-- Name: product_inventory_product_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_inventory_product_inventory_id_seq', 4, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_product_id_seq', 4, true);


--
-- Name: reset_password_token_reset_password_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reset_password_token_reset_password_token_id_seq', 1, false);


--
-- Name: setting_setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.setting_setting_id_seq', 18, true);


--
-- Name: shipment_shipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipment_shipment_id_seq', 1, false);


--
-- Name: shipping_method_shipping_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_method_shipping_method_id_seq', 1, false);


--
-- Name: shipping_zone_method_shipping_zone_method_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_zone_method_shipping_zone_method_id_seq', 1, false);


--
-- Name: shipping_zone_province_shipping_zone_province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_zone_province_shipping_zone_province_id_seq', 1, false);


--
-- Name: shipping_zone_shipping_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_zone_shipping_zone_id_seq', 1, false);


--
-- Name: tax_class_tax_class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tax_class_tax_class_id_seq', 1, true);


--
-- Name: tax_rate_tax_rate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tax_rate_tax_rate_id_seq', 1, true);


--
-- Name: url_rewrite_url_rewrite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.url_rewrite_url_rewrite_id_seq', 7, true);


--
-- Name: variant_group_variant_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variant_group_variant_group_id_seq', 1, false);


--
-- Name: widget_widget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.widget_widget_id_seq', 4, true);


--
-- Name: admin_user ADMIN_USER_EMAIL_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT "ADMIN_USER_EMAIL_UNIQUE" UNIQUE (email);


--
-- Name: admin_user ADMIN_USER_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT "ADMIN_USER_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: attribute ATTRIBUTE_CODE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute
    ADD CONSTRAINT "ATTRIBUTE_CODE_UNIQUE" UNIQUE (attribute_code);


--
-- Name: attribute ATTRIBUTE_CODE_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute
    ADD CONSTRAINT "ATTRIBUTE_CODE_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: attribute_group_link ATTRIBUTE_GROUP_LINK_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group_link
    ADD CONSTRAINT "ATTRIBUTE_GROUP_LINK_UNIQUE" UNIQUE (attribute_id, group_id);


--
-- Name: attribute_group ATTRIBUTE_GROUP_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group
    ADD CONSTRAINT "ATTRIBUTE_GROUP_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: attribute_option ATTRIBUTE_OPTION_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_option
    ADD CONSTRAINT "ATTRIBUTE_OPTION_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: cart_address CART_ADDRESS_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT "CART_ADDRESS_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: cart_item CART_ITEM_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "CART_ITEM_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: cart CART_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "CART_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: category_description CATEGORY_ID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_description
    ADD CONSTRAINT "CATEGORY_ID_UNIQUE" UNIQUE (category_description_category_id);


--
-- Name: category_description CATEGORY_URL_KEY_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_description
    ADD CONSTRAINT "CATEGORY_URL_KEY_UNIQUE" UNIQUE (url_key);


--
-- Name: category CATEGORY_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "CATEGORY_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: cms_page CMS_PAGE_UUID; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page
    ADD CONSTRAINT "CMS_PAGE_UUID" UNIQUE (uuid);


--
-- Name: collection COLLECTION_CODE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection
    ADD CONSTRAINT "COLLECTION_CODE_UNIQUE" UNIQUE (code);


--
-- Name: collection COLLECTION_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection
    ADD CONSTRAINT "COLLECTION_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: coupon COUPON_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT "COUPON_UNIQUE" UNIQUE (coupon);


--
-- Name: coupon COUPON_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT "COUPON_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: customer_address CUSTOMER_ADDRESS_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT "CUSTOMER_ADDRESS_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: customer CUSTOMER_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "CUSTOMER_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: customer EMAIL_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "EMAIL_UNIQUE" UNIQUE (email);


--
-- Name: event EVENT_UUID; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT "EVENT_UUID" UNIQUE (uuid);


--
-- Name: shipping_zone_method METHOD_ZONE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_method
    ADD CONSTRAINT "METHOD_ZONE_UNIQUE" UNIQUE (zone_id, method_id);


--
-- Name: migration MODULE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration
    ADD CONSTRAINT "MODULE_UNIQUE" UNIQUE (module);


--
-- Name: product_attribute_value_index OPTION_VALUE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_value_index
    ADD CONSTRAINT "OPTION_VALUE_UNIQUE" UNIQUE (product_id, attribute_id, option_id);


--
-- Name: order_activity ORDER_ACTIVITY_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_activity
    ADD CONSTRAINT "ORDER_ACTIVITY_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: order_address ORDER_ADDRESS_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT "ORDER_ADDRESS_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: order_item ORDER_ITEM_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "ORDER_ITEM_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: order ORDER_NUMBER_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "ORDER_NUMBER_UNIQUE" UNIQUE (order_number);


--
-- Name: order ORDER_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "ORDER_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: cms_page_description PAGE_ID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page_description
    ADD CONSTRAINT "PAGE_ID_UNIQUE" UNIQUE (cms_page_description_cms_page_id);


--
-- Name: payment_transaction PAYMENT_TRANSACTION_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transaction
    ADD CONSTRAINT "PAYMENT_TRANSACTION_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: product_collection PRODUCT_COLLECTION_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT "PRODUCT_COLLECTION_UNIQUE" UNIQUE (collection_id, product_id);


--
-- Name: product_custom_option PRODUCT_CUSTOM_OPTION_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option
    ADD CONSTRAINT "PRODUCT_CUSTOM_OPTION_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: product_custom_option_value PRODUCT_CUSTOM_OPTION_VALUE_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option_value
    ADD CONSTRAINT "PRODUCT_CUSTOM_OPTION_VALUE_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: product_description PRODUCT_ID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_description
    ADD CONSTRAINT "PRODUCT_ID_UNIQUE" UNIQUE (product_description_product_id);


--
-- Name: product_inventory PRODUCT_INVENTORY_PRODUCT_ID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_inventory
    ADD CONSTRAINT "PRODUCT_INVENTORY_PRODUCT_ID_UNIQUE" UNIQUE (product_inventory_product_id);


--
-- Name: product PRODUCT_SKU_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PRODUCT_SKU_UNIQUE" UNIQUE (sku);


--
-- Name: product_description PRODUCT_URL_KEY_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_description
    ADD CONSTRAINT "PRODUCT_URL_KEY_UNIQUE" UNIQUE (url_key);


--
-- Name: product PRODUCT_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PRODUCT_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: session SESSION_PKEY; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "SESSION_PKEY" PRIMARY KEY (sid);


--
-- Name: setting SETTING_NAME_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT "SETTING_NAME_UNIQUE" UNIQUE (name);


--
-- Name: setting SETTING_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT "SETTING_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: shipment SHIPMENT_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment
    ADD CONSTRAINT "SHIPMENT_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: shipping_method SHIPPING_METHOD_NAME_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_method
    ADD CONSTRAINT "SHIPPING_METHOD_NAME_UNIQUE" UNIQUE (name);


--
-- Name: shipping_method SHIPPING_METHOD_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_method
    ADD CONSTRAINT "SHIPPING_METHOD_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: shipping_zone_province SHIPPING_ZONE_PROVINCE_PROVINCE_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_province
    ADD CONSTRAINT "SHIPPING_ZONE_PROVINCE_PROVINCE_UNIQUE" UNIQUE (province);


--
-- Name: shipping_zone_province SHIPPING_ZONE_PROVINCE_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_province
    ADD CONSTRAINT "SHIPPING_ZONE_PROVINCE_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: shipping_zone SHIPPING_ZONE_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone
    ADD CONSTRAINT "SHIPPING_ZONE_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: tax_class TAX_CLASS_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_class
    ADD CONSTRAINT "TAX_CLASS_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: tax_rate TAX_RATE_PRIORITY_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "TAX_RATE_PRIORITY_UNIQUE" UNIQUE (priority, tax_class_id);


--
-- Name: tax_rate TAX_RATE_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "TAX_RATE_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: payment_transaction UNQ_PAYMENT_TRANSACTION_ID_ORDER_ID; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transaction
    ADD CONSTRAINT "UNQ_PAYMENT_TRANSACTION_ID_ORDER_ID" UNIQUE (payment_transaction_order_id, transaction_id);


--
-- Name: cms_page_description URL_KEY_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page_description
    ADD CONSTRAINT "URL_KEY_UNIQUE" UNIQUE (url_key);


--
-- Name: url_rewrite URL_REWRITE_PATH_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.url_rewrite
    ADD CONSTRAINT "URL_REWRITE_PATH_UNIQUE" UNIQUE (language, entity_uuid);


--
-- Name: variant_group VARIANT_GROUP_UUID_UNIQUE; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "VARIANT_GROUP_UUID_UNIQUE" UNIQUE (uuid);


--
-- Name: widget WIDGET_UUID; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget
    ADD CONSTRAINT "WIDGET_UUID" UNIQUE (uuid);


--
-- Name: admin_user admin_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_user
    ADD CONSTRAINT admin_user_pkey PRIMARY KEY (admin_user_id);


--
-- Name: attribute_group_link attribute_group_link_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group_link
    ADD CONSTRAINT attribute_group_link_pkey PRIMARY KEY (attribute_group_link_id);


--
-- Name: attribute_group attribute_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group
    ADD CONSTRAINT attribute_group_pkey PRIMARY KEY (attribute_group_id);


--
-- Name: attribute_option attribute_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_option
    ADD CONSTRAINT attribute_option_pkey PRIMARY KEY (attribute_option_id);


--
-- Name: attribute attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute
    ADD CONSTRAINT attribute_pkey PRIMARY KEY (attribute_id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (cart_address_id);


--
-- Name: cart_item cart_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_pkey PRIMARY KEY (cart_item_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- Name: category_description category_description_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_description
    ADD CONSTRAINT category_description_pkey PRIMARY KEY (category_description_id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- Name: cms_page_description cms_page_description_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page_description
    ADD CONSTRAINT cms_page_description_pkey PRIMARY KEY (cms_page_description_id);


--
-- Name: cms_page cms_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page
    ADD CONSTRAINT cms_page_pkey PRIMARY KEY (cms_page_id);


--
-- Name: collection collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection
    ADD CONSTRAINT collection_pkey PRIMARY KEY (collection_id);


--
-- Name: coupon coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT coupon_pkey PRIMARY KEY (coupon_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (customer_address_id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (customer_group_id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);


--
-- Name: migration migration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migration
    ADD CONSTRAINT migration_pkey PRIMARY KEY (migration_id);


--
-- Name: order_activity order_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_activity
    ADD CONSTRAINT order_activity_pkey PRIMARY KEY (order_activity_id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (order_address_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_item_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (order_id);


--
-- Name: payment_transaction payment_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transaction
    ADD CONSTRAINT payment_transaction_pkey PRIMARY KEY (payment_transaction_id);


--
-- Name: product_attribute_value_index product_attribute_value_index_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_value_index
    ADD CONSTRAINT product_attribute_value_index_pkey PRIMARY KEY (product_attribute_value_index_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (product_collection_id);


--
-- Name: product_custom_option product_custom_option_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option
    ADD CONSTRAINT product_custom_option_pkey PRIMARY KEY (product_custom_option_id);


--
-- Name: product_custom_option_value product_custom_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option_value
    ADD CONSTRAINT product_custom_option_value_pkey PRIMARY KEY (product_custom_option_value_id);


--
-- Name: product_description product_description_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_description
    ADD CONSTRAINT product_description_pkey PRIMARY KEY (product_description_id);


--
-- Name: product_image product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT product_image_pkey PRIMARY KEY (product_image_id);


--
-- Name: product_inventory product_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_inventory
    ADD CONSTRAINT product_inventory_pkey PRIMARY KEY (product_inventory_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: reset_password_token reset_password_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reset_password_token
    ADD CONSTRAINT reset_password_token_pkey PRIMARY KEY (reset_password_token_id);


--
-- Name: setting setting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (setting_id);


--
-- Name: shipment shipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment
    ADD CONSTRAINT shipment_pkey PRIMARY KEY (shipment_id);


--
-- Name: shipping_method shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_method
    ADD CONSTRAINT shipping_method_pkey PRIMARY KEY (shipping_method_id);


--
-- Name: shipping_zone_method shipping_zone_method_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_method
    ADD CONSTRAINT shipping_zone_method_pkey PRIMARY KEY (shipping_zone_method_id);


--
-- Name: shipping_zone shipping_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone
    ADD CONSTRAINT shipping_zone_pkey PRIMARY KEY (shipping_zone_id);


--
-- Name: shipping_zone_province shipping_zone_province_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_province
    ADD CONSTRAINT shipping_zone_province_pkey PRIMARY KEY (shipping_zone_province_id);


--
-- Name: tax_class tax_class_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_class
    ADD CONSTRAINT tax_class_pkey PRIMARY KEY (tax_class_id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (tax_rate_id);


--
-- Name: url_rewrite url_rewrite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.url_rewrite
    ADD CONSTRAINT url_rewrite_pkey PRIMARY KEY (url_rewrite_id);


--
-- Name: variant_group variant_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT variant_group_pkey PRIMARY KEY (variant_group_id);


--
-- Name: widget widget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widget
    ADD CONSTRAINT widget_pkey PRIMARY KEY (widget_id);


--
-- Name: FK_ATTRIBUTE_GROUP_VARIANT; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_GROUP_VARIANT" ON public.variant_group USING btree (attribute_group_id);


--
-- Name: FK_ATTRIBUTE_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_LINK" ON public.attribute_group_link USING btree (attribute_id);


--
-- Name: FK_ATTRIBUTE_OPTION; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_OPTION" ON public.attribute_option USING btree (attribute_id);


--
-- Name: FK_ATTRIBUTE_OPTION_VALUE_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_OPTION_VALUE_LINK" ON public.product_attribute_value_index USING btree (option_id);


--
-- Name: FK_ATTRIBUTE_VALUE_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VALUE_LINK" ON public.product_attribute_value_index USING btree (attribute_id);


--
-- Name: FK_ATTRIBUTE_VARIANT_FIVE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VARIANT_FIVE" ON public.variant_group USING btree (attribute_five);


--
-- Name: FK_ATTRIBUTE_VARIANT_FOUR; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VARIANT_FOUR" ON public.variant_group USING btree (attribute_four);


--
-- Name: FK_ATTRIBUTE_VARIANT_ONE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VARIANT_ONE" ON public.variant_group USING btree (attribute_one);


--
-- Name: FK_ATTRIBUTE_VARIANT_THREE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VARIANT_THREE" ON public.variant_group USING btree (attribute_three);


--
-- Name: FK_ATTRIBUTE_VARIANT_TWO; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ATTRIBUTE_VARIANT_TWO" ON public.variant_group USING btree (attribute_two);


--
-- Name: FK_CART_ITEM; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CART_ITEM" ON public.cart_item USING btree (cart_id);


--
-- Name: FK_CART_ITEM_PRODUCT; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CART_ITEM_PRODUCT" ON public.cart_item USING btree (product_id);


--
-- Name: FK_CART_SHIPPING_ZONE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CART_SHIPPING_ZONE" ON public.cart USING btree (shipping_zone_id);


--
-- Name: FK_CATEGORY_DESCRIPTION; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CATEGORY_DESCRIPTION" ON public.category_description USING btree (category_description_category_id);


--
-- Name: FK_CMS_PAGE_DESCRIPTION; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CMS_PAGE_DESCRIPTION" ON public.cms_page_description USING btree (cms_page_description_cms_page_id);


--
-- Name: FK_COLLECTION_PRODUCT_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_COLLECTION_PRODUCT_LINK" ON public.product_collection USING btree (collection_id);


--
-- Name: FK_CUSTOMER_ADDRESS; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CUSTOMER_ADDRESS" ON public.customer_address USING btree (customer_id);


--
-- Name: FK_CUSTOMER_GROUP; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CUSTOMER_GROUP" ON public.customer USING btree (group_id);


--
-- Name: FK_CUSTOM_OPTION_VALUE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_CUSTOM_OPTION_VALUE" ON public.product_custom_option_value USING btree (option_id);


--
-- Name: FK_GROUP_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_GROUP_LINK" ON public.attribute_group_link USING btree (group_id);


--
-- Name: FK_METHOD_ZONE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_METHOD_ZONE" ON public.shipping_zone_method USING btree (method_id);


--
-- Name: FK_ORDER; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ORDER" ON public.order_item USING btree (order_item_order_id);


--
-- Name: FK_ORDER_ACTIVITY; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ORDER_ACTIVITY" ON public.order_activity USING btree (order_activity_order_id);


--
-- Name: FK_ORDER_SHIPMENT; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ORDER_SHIPMENT" ON public.shipment USING btree (shipment_order_id);


--
-- Name: FK_PAYMENT_TRANSACTION_ORDER; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PAYMENT_TRANSACTION_ORDER" ON public.payment_transaction USING btree (payment_transaction_order_id);


--
-- Name: FK_PRODUCT_ATTRIBUTE_GROUP; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_ATTRIBUTE_GROUP" ON public.product USING btree (group_id);


--
-- Name: FK_PRODUCT_ATTRIBUTE_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_ATTRIBUTE_LINK" ON public.product_attribute_value_index USING btree (product_id);


--
-- Name: FK_PRODUCT_COLLECTION_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_COLLECTION_LINK" ON public.product_collection USING btree (product_id);


--
-- Name: FK_PRODUCT_CUSTOM_OPTION; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_CUSTOM_OPTION" ON public.product_custom_option USING btree (product_custom_option_product_id);


--
-- Name: FK_PRODUCT_DESCRIPTION; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_DESCRIPTION" ON public.product_description USING btree (product_description_product_id);


--
-- Name: FK_PRODUCT_IMAGE_LINK; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_IMAGE_LINK" ON public.product_image USING btree (product_image_product_id);


--
-- Name: FK_PRODUCT_VARIANT_GROUP; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_PRODUCT_VARIANT_GROUP" ON public.product USING btree (variant_group_id);


--
-- Name: FK_SHIPPING_ZONE_PROVINCE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_SHIPPING_ZONE_PROVINCE" ON public.shipping_zone_province USING btree (zone_id);


--
-- Name: FK_ZONE_METHOD; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FK_ZONE_METHOD" ON public.shipping_zone_method USING btree (zone_id);


--
-- Name: IDX_SESSION_EXPIRE; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_SESSION_EXPIRE" ON public.session USING btree (expire);


--
-- Name: PRODUCT_SEARCH_INDEX; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PRODUCT_SEARCH_INDEX" ON public.product_description USING gin (to_tsvector('simple'::regconfig, (((name)::text || ' '::text) || description)));


--
-- Name: category ADD_CATEGORY_CREATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CATEGORY_CREATED_EVENT_TRIGGER" AFTER INSERT ON public.category FOR EACH ROW EXECUTE FUNCTION public.add_category_created_event();


--
-- Name: category ADD_CATEGORY_DELETED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CATEGORY_DELETED_EVENT_TRIGGER" AFTER DELETE ON public.category FOR EACH ROW EXECUTE FUNCTION public.add_category_deleted_event();


--
-- Name: category ADD_CATEGORY_UPDATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CATEGORY_UPDATED_EVENT_TRIGGER" AFTER UPDATE ON public.category FOR EACH ROW EXECUTE FUNCTION public.add_category_updated_event();


--
-- Name: customer ADD_CUSTOMER_CREATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CUSTOMER_CREATED_EVENT_TRIGGER" AFTER INSERT ON public.customer FOR EACH ROW EXECUTE FUNCTION public.add_customer_created_event();


--
-- Name: customer ADD_CUSTOMER_DELETED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CUSTOMER_DELETED_EVENT_TRIGGER" AFTER DELETE ON public.customer FOR EACH ROW EXECUTE FUNCTION public.add_customer_deleted_event();


--
-- Name: customer ADD_CUSTOMER_UPDATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_CUSTOMER_UPDATED_EVENT_TRIGGER" AFTER UPDATE ON public.customer FOR EACH ROW EXECUTE FUNCTION public.add_customer_updated_event();


--
-- Name: product_inventory ADD_INVENTORY_UPDATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_INVENTORY_UPDATED_EVENT_TRIGGER" AFTER UPDATE ON public.product_inventory FOR EACH ROW EXECUTE FUNCTION public.add_product_inventory_updated_event();


--
-- Name: order ADD_ORDER_CREATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_ORDER_CREATED_EVENT_TRIGGER" AFTER INSERT ON public."order" FOR EACH ROW EXECUTE FUNCTION public.add_order_created_event();


--
-- Name: product ADD_PRODUCT_CREATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_PRODUCT_CREATED_EVENT_TRIGGER" AFTER INSERT ON public.product FOR EACH ROW EXECUTE FUNCTION public.add_product_created_event();


--
-- Name: product ADD_PRODUCT_DELETED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_PRODUCT_DELETED_EVENT_TRIGGER" AFTER DELETE ON public.product FOR EACH ROW EXECUTE FUNCTION public.add_product_deleted_event();


--
-- Name: product ADD_PRODUCT_UPDATED_EVENT_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "ADD_PRODUCT_UPDATED_EVENT_TRIGGER" AFTER UPDATE ON public.product FOR EACH ROW EXECUTE FUNCTION public.add_product_updated_event();


--
-- Name: category_description BUILD_CATEGORY_URL_KEY_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "BUILD_CATEGORY_URL_KEY_TRIGGER" BEFORE INSERT OR UPDATE ON public.category_description FOR EACH ROW EXECUTE FUNCTION public.build_url_key();


--
-- Name: product_description BUILD_PRODUCT_URL_KEY_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "BUILD_PRODUCT_URL_KEY_TRIGGER" BEFORE INSERT OR UPDATE ON public.product_description FOR EACH ROW EXECUTE FUNCTION public.build_url_key();


--
-- Name: category DELETE_SUB_CATEGORIES_TRIGGER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "DELETE_SUB_CATEGORIES_TRIGGER" AFTER DELETE ON public.category FOR EACH ROW EXECUTE FUNCTION public.delete_sub_categories();


--
-- Name: product PREVENT_CHANGING_ATTRIBUTE_GROUP_OF_PRODUCT_WITH_VARIANTS; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "PREVENT_CHANGING_ATTRIBUTE_GROUP_OF_PRODUCT_WITH_VARIANTS" BEFORE UPDATE ON public.product FOR EACH ROW EXECUTE FUNCTION public.prevent_change_attribute_group();


--
-- Name: attribute_group PREVENT_DELETING_THE_DEFAULT_ATTRIBUTE_GROUP; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "PREVENT_DELETING_THE_DEFAULT_ATTRIBUTE_GROUP" BEFORE DELETE ON public.attribute_group FOR EACH ROW EXECUTE FUNCTION public.prevent_delete_default_attribute_group();


--
-- Name: customer_group PREVENT_DELETING_THE_DEFAULT_CUSTOMER_GROUP; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "PREVENT_DELETING_THE_DEFAULT_CUSTOMER_GROUP" BEFORE DELETE ON public.customer_group FOR EACH ROW EXECUTE FUNCTION public.prevent_delete_default_customer_group();


--
-- Name: tax_class PREVENT_DELETING_THE_DEFAULT_TAX_CLASS; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "PREVENT_DELETING_THE_DEFAULT_TAX_CLASS" BEFORE DELETE ON public.tax_class FOR EACH ROW EXECUTE FUNCTION public.prevent_delete_default_tax_class();


--
-- Name: product_image PRODUCT_IMAGE_ADDED; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "PRODUCT_IMAGE_ADDED" AFTER INSERT ON public.product_image FOR EACH ROW EXECUTE FUNCTION public.product_image_insert_trigger();


--
-- Name: customer SET_DEFAULT_CUSTOMER_GROUP; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "SET_DEFAULT_CUSTOMER_GROUP" BEFORE INSERT ON public.customer FOR EACH ROW EXECUTE FUNCTION public.set_default_customer_group();


--
-- Name: attribute_option TRIGGER_AFTER_ATTRIBUTE_OPTION_UPDATE; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_AFTER_ATTRIBUTE_OPTION_UPDATE" AFTER UPDATE ON public.attribute_option FOR EACH ROW EXECUTE FUNCTION public.update_product_attribute_option_value_text();


--
-- Name: attribute_option TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION" AFTER DELETE ON public.attribute_option FOR EACH ROW EXECUTE FUNCTION public.delete_product_attribute_value_index();


--
-- Name: order_item TRIGGER_AFTER_INSERT_ORDER_ITEM; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_AFTER_INSERT_ORDER_ITEM" AFTER INSERT ON public.order_item FOR EACH ROW EXECUTE FUNCTION public.reduce_product_stock_when_order_placed();


--
-- Name: product TRIGGER_AFTER_INSERT_PRODUCT; Type: TRIGGER; Schema: public; Owner: -
--

CREATE CONSTRAINT TRIGGER "TRIGGER_AFTER_INSERT_PRODUCT" AFTER INSERT ON public.product DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE FUNCTION public.update_variant_group_visibility();


--
-- Name: attribute_group_link TRIGGER_AFTER_REMOVE_ATTRIBUTE_FROM_GROUP; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_AFTER_REMOVE_ATTRIBUTE_FROM_GROUP" AFTER DELETE ON public.attribute_group_link FOR EACH ROW EXECUTE FUNCTION public.remove_attribute_from_group();


--
-- Name: attribute TRIGGER_AFTER_UPDATE_ATTRIBUTE; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_AFTER_UPDATE_ATTRIBUTE" AFTER UPDATE ON public.attribute FOR EACH ROW EXECUTE FUNCTION public.delete_variant_group_after_attribute_type_changed();


--
-- Name: product TRIGGER_PRODUCT_AFTER_UPDATE; Type: TRIGGER; Schema: public; Owner: -
--

CREATE CONSTRAINT TRIGGER "TRIGGER_PRODUCT_AFTER_UPDATE" AFTER UPDATE ON public.product DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION public.update_attribute_index_and_variant_group_visibility();


--
-- Name: order TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER" AFTER INSERT ON public."order" FOR EACH ROW EXECUTE FUNCTION public.set_coupon_used_time();


--
-- Name: variant_group FK_ATTRIBUTE_GROUP_VARIANT; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_GROUP_VARIANT" FOREIGN KEY (attribute_group_id) REFERENCES public.attribute_group(attribute_group_id) ON DELETE CASCADE;


--
-- Name: attribute_group_link FK_ATTRIBUTE_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group_link
    ADD CONSTRAINT "FK_ATTRIBUTE_LINK" FOREIGN KEY (attribute_id) REFERENCES public.attribute(attribute_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attribute_option FK_ATTRIBUTE_OPTION; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_option
    ADD CONSTRAINT "FK_ATTRIBUTE_OPTION" FOREIGN KEY (attribute_id) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: product_attribute_value_index FK_ATTRIBUTE_OPTION_VALUE_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_value_index
    ADD CONSTRAINT "FK_ATTRIBUTE_OPTION_VALUE_LINK" FOREIGN KEY (option_id) REFERENCES public.attribute_option(attribute_option_id) ON DELETE CASCADE;


--
-- Name: product_attribute_value_index FK_ATTRIBUTE_VALUE_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_value_index
    ADD CONSTRAINT "FK_ATTRIBUTE_VALUE_LINK" FOREIGN KEY (attribute_id) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: variant_group FK_ATTRIBUTE_VARIANT_FIVE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_VARIANT_FIVE" FOREIGN KEY (attribute_five) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: variant_group FK_ATTRIBUTE_VARIANT_FOUR; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_VARIANT_FOUR" FOREIGN KEY (attribute_four) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: variant_group FK_ATTRIBUTE_VARIANT_ONE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_VARIANT_ONE" FOREIGN KEY (attribute_one) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: variant_group FK_ATTRIBUTE_VARIANT_THREE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_VARIANT_THREE" FOREIGN KEY (attribute_three) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: variant_group FK_ATTRIBUTE_VARIANT_TWO; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_group
    ADD CONSTRAINT "FK_ATTRIBUTE_VARIANT_TWO" FOREIGN KEY (attribute_two) REFERENCES public.attribute(attribute_id) ON DELETE CASCADE;


--
-- Name: cart_item FK_CART_ITEM; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_CART_ITEM" FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item FK_CART_ITEM_PRODUCT; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_CART_ITEM_PRODUCT" FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: cart FK_CART_SHIPPING_ZONE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "FK_CART_SHIPPING_ZONE" FOREIGN KEY (shipping_zone_id) REFERENCES public.shipping_zone(shipping_zone_id) ON DELETE SET NULL;


--
-- Name: category_description FK_CATEGORY_DESCRIPTION; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_description
    ADD CONSTRAINT "FK_CATEGORY_DESCRIPTION" FOREIGN KEY (category_description_category_id) REFERENCES public.category(category_id) ON DELETE CASCADE;


--
-- Name: cms_page_description FK_CMS_PAGE_DESCRIPTION; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_page_description
    ADD CONSTRAINT "FK_CMS_PAGE_DESCRIPTION" FOREIGN KEY (cms_page_description_cms_page_id) REFERENCES public.cms_page(cms_page_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_collection FK_COLLECTION_PRODUCT_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT "FK_COLLECTION_PRODUCT_LINK" FOREIGN KEY (collection_id) REFERENCES public.collection(collection_id) ON DELETE CASCADE;


--
-- Name: customer_address FK_CUSTOMER_ADDRESS; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT "FK_CUSTOMER_ADDRESS" FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: customer FK_CUSTOMER_GROUP; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "FK_CUSTOMER_GROUP" FOREIGN KEY (group_id) REFERENCES public.customer_group(customer_group_id) ON DELETE SET NULL;


--
-- Name: product_custom_option_value FK_CUSTOM_OPTION_VALUE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option_value
    ADD CONSTRAINT "FK_CUSTOM_OPTION_VALUE" FOREIGN KEY (option_id) REFERENCES public.product_custom_option(product_custom_option_id) ON DELETE CASCADE;


--
-- Name: attribute_group_link FK_GROUP_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_group_link
    ADD CONSTRAINT "FK_GROUP_LINK" FOREIGN KEY (group_id) REFERENCES public.attribute_group(attribute_group_id) ON DELETE CASCADE;


--
-- Name: shipping_zone_method FK_METHOD_ZONE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_method
    ADD CONSTRAINT "FK_METHOD_ZONE" FOREIGN KEY (method_id) REFERENCES public.shipping_method(shipping_method_id) ON DELETE CASCADE;


--
-- Name: order_item FK_ORDER; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_ORDER" FOREIGN KEY (order_item_order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;


--
-- Name: order_activity FK_ORDER_ACTIVITY; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_activity
    ADD CONSTRAINT "FK_ORDER_ACTIVITY" FOREIGN KEY (order_activity_order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;


--
-- Name: shipment FK_ORDER_SHIPMENT; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment
    ADD CONSTRAINT "FK_ORDER_SHIPMENT" FOREIGN KEY (shipment_order_id) REFERENCES public."order"(order_id) ON DELETE CASCADE;


--
-- Name: payment_transaction FK_PAYMENT_TRANSACTION_ORDER; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transaction
    ADD CONSTRAINT "FK_PAYMENT_TRANSACTION_ORDER" FOREIGN KEY (payment_transaction_order_id) REFERENCES public."order"(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product FK_PRODUCT_ATTRIBUTE_GROUP; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_PRODUCT_ATTRIBUTE_GROUP" FOREIGN KEY (group_id) REFERENCES public.attribute_group(attribute_group_id) ON DELETE SET NULL;


--
-- Name: product_attribute_value_index FK_PRODUCT_ATTRIBUTE_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_attribute_value_index
    ADD CONSTRAINT "FK_PRODUCT_ATTRIBUTE_LINK" FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: product_collection FK_PRODUCT_COLLECTION_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT "FK_PRODUCT_COLLECTION_LINK" FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: product_custom_option FK_PRODUCT_CUSTOM_OPTION; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_custom_option
    ADD CONSTRAINT "FK_PRODUCT_CUSTOM_OPTION" FOREIGN KEY (product_custom_option_product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: product_description FK_PRODUCT_DESCRIPTION; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_description
    ADD CONSTRAINT "FK_PRODUCT_DESCRIPTION" FOREIGN KEY (product_description_product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: product_image FK_PRODUCT_IMAGE_LINK; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "FK_PRODUCT_IMAGE_LINK" FOREIGN KEY (product_image_product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- Name: product FK_PRODUCT_VARIANT_GROUP; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_PRODUCT_VARIANT_GROUP" FOREIGN KEY (variant_group_id) REFERENCES public.variant_group(variant_group_id) ON DELETE SET NULL;


--
-- Name: reset_password_token FK_RESET_PASSWORD_TOKEN_CUSTOMER; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reset_password_token
    ADD CONSTRAINT "FK_RESET_PASSWORD_TOKEN_CUSTOMER" FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: shipping_zone_province FK_SHIPPING_ZONE_PROVINCE; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_province
    ADD CONSTRAINT "FK_SHIPPING_ZONE_PROVINCE" FOREIGN KEY (zone_id) REFERENCES public.shipping_zone(shipping_zone_id) ON DELETE CASCADE;


--
-- Name: product FK_TAX_CLASS; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_TAX_CLASS" FOREIGN KEY (tax_class) REFERENCES public.tax_class(tax_class_id) ON DELETE SET NULL;


--
-- Name: tax_rate FK_TAX_RATE_TAX_CLASS; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_TAX_RATE_TAX_CLASS" FOREIGN KEY (tax_class_id) REFERENCES public.tax_class(tax_class_id) ON DELETE CASCADE;


--
-- Name: shipping_zone_method FK_ZONE_METHOD; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zone_method
    ADD CONSTRAINT "FK_ZONE_METHOD" FOREIGN KEY (zone_id) REFERENCES public.shipping_zone(shipping_zone_id) ON DELETE CASCADE;


--
-- Name: product PRODUCT_CATEGORY_ID_CONSTRAINT; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PRODUCT_CATEGORY_ID_CONSTRAINT" FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON DELETE SET NULL;


--
-- Name: product_inventory PRODUCT_INVENTORY_PRODUCT_ID_CONSTANTSRAINT; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_inventory
    ADD CONSTRAINT "PRODUCT_INVENTORY_PRODUCT_ID_CONSTANTSRAINT" FOREIGN KEY (product_inventory_product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

